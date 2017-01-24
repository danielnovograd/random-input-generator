'use strict'

const generate = {
  number: () => generateNumber(),
  string: () => generateString(),
  boolean: () => Math.random() < .5,
  object: () => generateObject(),
  array: () => generateArray(),
  random: function(...types){
    let typeIndex = types.length ? generateNumber(0, types.length - 1) : generateNumber(0,3);
    let type = types.length ? types[typeIndex] : typeArray[typeIndex];
    return this[type]();
  },
  type: () => typeArray[generateNumber(0, typeArray.length - 1)]
};

const typeArray = ["number", "string", "boolean", "object", "array"];
const primitives = ["number", "string", "boolean"];

//create random number
const generateNumber = (min = 0, max = 10000, rounded = true) => {
  if (min > max) {
    throw Error('Invalid Arguments: min argument must be less than max');
  }
  else {
    return rounded ? Math.floor(Math.random() * (max - min + 1)) + min : Math.random() * (max - min + 1) + min;
  }
};
  //create random string, default (0-8 characters, can be symbols, casing "upper" or "lower")
const generateString = (minLength = 4, maxLength = 12, nonLetters = true, casing) => {
  if (typeof minLength !== "number" || typeof maxLength !== "number" || typeof nonLetters !== "boolean" || (typeof casing !== "undefined" && typeof casing !== "string")) {
    throw Error('Invalid argument type. minLength: number, maxLength: number, nonLetters: boolean, casing: string or undefined');
  }
  if (minLength > maxLength || minLength < 0) {
    throw Error('Invalid length arguments: minLength must be less than maxLength.')
  }
  let specificLength;
  if (minLength === maxLength) {
    specificLength = maxLength;
  }
  const length = specificLength || generateNumber(minLength, maxLength);
  let randomString = "";
  let minCode = nonLetters ? 32 : 65;
  let maxCode = nonLetters ? 127 : 123;
  while(randomString.length < length) {
    randomString += characterGen(minCode, maxCode, nonLetters);
  };
  return casing ? enforceCase(randomString, casing.toLowerCase()) : randomString;
};
  //check if code is for nonLetter
const isNonLetterCode = (code) => code < 65 || (code >= 91 && code <= 96) || code > 122;
const characterGen = (charCodeMin = 32, charCodeMax = 127, nonLetters = true) => {
  if (typeof charCodeMin !== "number" || typeof charCodeMax !== "number" || typeof nonLetters !== "boolean") {
    throw Error('Invalid argument type. charCodes must be numbers and nonLetters must be boolean.')
  }
  let charCodeIndex = generateNumber(charCodeMin, charCodeMax);
    while(charCodeIndex === 92 || (!nonLetters && isNonLetterCode(charCodeIndex))) {
      charCodeIndex = generateNumber(charCodeMin, charCodeMax);
    }
  return String.fromCharCode(charCodeIndex);
};
const enforceCase = (str, casing) => {
  if (casing === "upper") { return str.toUpperCase(); }
  else if (casing === "lower") { return str.toLowerCase(); }
  else { throw Error("Invalid casing argument: must be either 'upper' or 'lower'") }
};
const generateBoolean = (weightPercentage) => {
  if(weightPercentage !== undefined) {
    if (typeof weightPercentage !== "number") {
      throw Error('Invalid argument: weightPercentage must be a number between 0 and 100');
    }
    else if (weightPercentage > 100 || weightPercentage < 0) {
      throw Error('Invalid argument: weightPercentage must be a number between 0 and 100')
    }
  }
  return Math.random() < (weightPercentage ? weightPercentage / 100 : .5);
};
  //generate object
const generateObject = function({keyValPairs, optionalSkeleton, valPreference = [], minKeyValPairs = 2, maxKeyValPairs = 6, maxDepth} = {}) {
  let result = {};
  if (arguments[0] !== null && typeof arguments[0] !== "object" && arguments[0] !== undefined) {
    throw new TypeError("Invalid parameter: must provide configuration object.")
  }
  if (valPreference.length && !valPreference.every(type => generate[type])) {
    throw Error("Invalid parameter: enter valPreferences that align with generate object's keys.")
  }
  //if skeleton argument is provided
  if (optionalSkeleton) {
    if (typeof optionalSkeleton !== "object") {
      throw Error("Invalid object skeleton: You can provide a config object or an array of desired keys.")
    }
    //if array of keys is provided --> vals are randomized
    else if (Array.isArray(optionalSkeleton)) {
      optionalSkeleton.forEach(key => {
        if (typeof key !== "string") {
          throw Error("Invalid key type: All properties of destination object must be strings");
        }
        let valType = valPreference.length ? valPreference[generateNumber(0, valPreference.length - 1)] : generate.type();
        var val = valType === "object" ? objectDepthControl({}, 1) : generate[valType]();
        result[key] = val;
      });
    }
    //if skeleton object provided: keys with default values
    else {
      if (keyValPairs <= Object.keys(optionalSkeleton).length) {
        throw Error("Invalid keyValPairs: must be integer greater than existing keyValPairs in skeleton object.")
      }
      return objectDepthControl(optionalSkeleton, 0, keyValPairs, maxDepth);
    };
  }
  else {
    return objectDepthControl({}, 0, keyValPairs || generateNumber(minKeyValPairs, maxKeyValPairs), maxDepth);
  };
  return result;
};

//if object is randomly generated, control depth so that it can only nest 3 levels
  //maxDepth will be 3 levels
  //every time another nested object is randomly generated, add to depth and build new object
const objectDepthControl = function(currentObject, depth, keyVals, maxDepth = 3) {
  var keyVals = keyVals || generateNumber(1, 5);
  let keyValCount = Object.keys(currentObject).length || 0;

  while (keyValCount < keyVals) {
    let key = generateString(4,6, false, "lower");
    if (depth > maxDepth) {
      var val = generate.random(...primitives);
    }
    else {
      var valType = generate.type();
      var val = valType === "object" ? objectDepthControl({}, depth + 1) :
        valType === "array" ? arrayDepthControl([], depth + 1) : generate[valType]();
    };

    currentObject[key] = val;
    keyValCount++;
  };
  return currentObject;
};
  //generate array of values, randomized by default
const generateArray = function({setLength, minLength = 0, maxLength = 5, valTypes = [], templateArray = [], valueGenerator} = {}) {
  if (arguments[0] !== null && typeof arguments[0] !== "object" && arguments[0] !== undefined) {
    throw new TypeError("Invalid argument: must provide configuration object.")
  }
  if (maxLength && typeof maxLength !== "number" || setLength && typeof setLength !== "number" || minLength && typeof minLength !== "number") {
    throw new TypeError("Invalid argument: maxLength must be a number.");
  };

  if (!Array.isArray(valTypes)) {
    throw new TypeError("Invalid argument: valTypes must be an array.");
  };
  if (!Array.isArray(templateArray)) {
    throw new TypeError("Invalid argument: templateArray must be an array.");
  };

  let length = setLength || generateNumber(minLength, maxLength);
  let arr = templateArray.length ? [].concat(templateArray) : [];

  if (!valueGenerator) {
    return arrayDepthControl(arr, 0, length, 3, valTypes);
  }
  else {
    while(arr.length < length) {
      let val = typeof valueGenerator === "function" ? valueGenerator() : valueGenerator;
      arr.push(val);
    };
  };
  return arr;
};

const arrayDepthControl = function(currentArray, depth, maxLength, maxDepth = 3, valTypes = []) {
  var values = maxLength || generateNumber(0, 4);
  let val;
  if (depth > maxDepth) {
    while (currentArray.length < values) {
      val = generate.random(...primitives);
      currentArray.push(val);
    }
  }
  else {
    while (currentArray.length < values) {
      let valType = valTypes.length ? valTypes[generateNumber(0, valTypes.length - 1)] : generate.type();
      val = valType === "object" ? objectDepthControl({}, depth + 1) :
        valType === "array" ? arrayDepthControl([], depth + 1) : generate[valType]();
      currentArray.push(val);
    }
  };
  return currentArray;
};

module.exports = {
  generateNumber,
  generateString,
  isNonLetterCode,
  characterGen,
  enforceCase,
  generateBoolean,
  generateObject,
  generateArray,
  defaultGenerator: generate
}