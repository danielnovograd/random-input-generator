const generate = {
  number: () => generateNumber(),
  string: () => generateString(),
  boolean: () => Math.random() < .5,
  object: () => generateObject(5),
  random: function(...types){
    let typeIndex = types.length ? generateNumber(0, types.length - 1) : generateNumber(0,3);
    let type = types.length ? types[typeIndex] : typeArray[typeIndex];
    return this[type]();
  },
  type: () => typeArray[generateNumber(0, typeArray.length - 1)]
};

const typeArray = ["number", "string", "boolean", "object"];

//create random number
const generateNumber = (min = 0, max = 10000) => min > max ?
      Error('Invalid Arguments: min argument must be less than max') :
      Math.floor(Math.random() * (max + 1 - min) + min);
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
const generateObject = (keyValPairs, optionalSkeleton, valPreference = ["random"], minKeyValPairs = 2, maxKeyValPairs = 6) => {
  let result = {};
  //if skeleton argument is provided
  if (optionalSkeleton) {
    if (typeof optionalSkeleton !== "object") {
      console.error("Invalid object skeleton: You can provide a config object or an array of desired keys.")
    }
    //if array of keys is provided --> vals are randomized
    else if (Array.isArray(optionalSkeleton)) {
      optionalSkeleton.forEach(key => result[key] = generate.random());
    }
    //if skeleton object provided: keys with default values
    else {
      result = optionalSkeleton
      for (var key in optionalSkeleton) {
        result[key] = generate[optionalSkeleton[key]] ? generate[optionalSkeleton[key]]()
          : optionalSkeleton[key] || generate.random();
      }
    }
  }
  else {
    const keyVals = keyValPairs || generateNumber(minKeyValPairs, maxKeyValPairs);
    let keyValCount = 0;
    let depth = 1;

    while (keyValCount < keyVals) {
      let key = generateString(4,6, false, "lower");
      let val;
      let valType = generate.type();
      if (valType === "object") {
        val = objectDepthControl({}, depth);
      }
      else {
        val = generate[valType]();
      }
      result[key] = val;
      keyValCount++
    };
  }
  return result;
};

//if object is randomly generated, control depth so that it can only nest 3 levels
  //maxDepth will be 3 levels
  //every time another nested object is randomly generated, add to depth and build new object
const objectDepthControl = function(currentObject, depth, keyVals) {
  var keyVals = generateNumber(1, 3);
  let keyValCount = 0;
  if (depth >= 3) {
    let primitives = ["number", "string", "boolean"];
    while (keyValCount < keyVals) {
      let key = generateString(1,6, false, "lower");
      let val = generate.random(...primitives);
      currentObject[key] = val;
      keyValCount++
    };
  }
  else {
    while (keyValCount < keyVals) {
      let key = generateString(1,6, false, "lower");
      let val;
      let valType = generate.type();
      if (valType === "object") {
        val = objectDepthControl({}, depth + 1);
      }
      else {
        console.log(valType)
        val = generate[valType]();
      }
      currentObject[key] = val;
      keyValCount++
    };
  };
  return currentObject;
};
  //generate array of values, randomized by default
const array = (maxLength = 10, valTypes = ["random"], templateArray) => {
  maxLength = maxLength || generateNumber(0, 10);
  if (templateArray && !Array.isArray(templateArray)) {
    console.error("Invalid templateArray: Not an array.")
  }
  let arr = templateArray || [];
  while(arr.length < maxLength) {
    let valType = valTypes.length > 1 ? generateNumber(0,valTypes.length) : valTypes[0]
    arr.push(generate[valType]());
  }
  return arr;
}

module.exports = {
  generateNumber,
  generateString,
  isNonLetterCode,
  characterGen,
  enforceCase,
  generateBoolean,
  generateObject,
  array: array
}