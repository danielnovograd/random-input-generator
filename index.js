const generate = {
  number: ((...args) => generator.number.apply(this, args)),
  string: (() => generator.string()),
  boolean: (() => Math.random() < .5),
  object: (() => generator.object(5)),
  random: function(...types){
    if (types.includes("object") || types.includes("array")){
      console.error("Cannot randomly generate object.");
      return;
    }
    let type = types.length ? types[this.number(0, types.length)] : typeArray[generator.number(0,3)]
    return this[type]();
  }
};

const typeArray = ["number", "string", "boolean", "object"];

const generator = {
  //create random number
  number: function(min = 0, max = 10001) {
    return min > max ?
      Error('Invalid Arguments: min argument must be less than max') :
      Math.floor(Math.random() * (max - min) + min)
  },
  //create random string, default (0-8 characters, can be symbols)
  string: function(minLength = 4, maxLength = 12, nonLetters = true, casing) {
    const length = this.number(minLength, maxLength);
    let randomString = "";
    let minCode = nonLetters ? 32 : 65;
    let maxCode = nonLetters ? 127 : 123;

    while(randomString.length < length) {
      randomString += this.characterGen(minCode, maxCode, nonLetters);
    };

    return casing ? this.enforceCase(randomString, casing.toLowerCase()) : randomString;
  },
  //check if code is for nonLetter
  isNonLetterCode: (code) => code < 65 || (code >= 91 && code <= 96) || code > 122,
  characterGen: function(charCodeMin = 32, charCodeMax = 127, nonLetters = true) {
    if (typeof charCodeMin !== "number" || typeof nonLetters !== "boolean") {
      throw Error('Invalid argument type. charCodes must be numbers and nonLetters must be boolean.')
    }
    let charCodeIndex = this.number(charCodeMin, charCodeMax);
      while(charCodeIndex === 92 || (!nonLetters && this.isNonLetterCode(charCodeIndex))) {
        charCodeIndex = this.number(charCodeMin, charCodeMax);
      }
    return String.fromCharCode(charCodeIndex);
  },
  enforceCase: (string, casing) => {
    if (casing === "upper") { return string.toUpperCase(); }
    else if (casing === "lower") { return string.toLowerCase(); }
    else { throw Error("Invalid casing argument: must be either 'upper' or 'lower'") }
  },
  //generate object
    //
  object: function(keyValPairs, optionalSkeleton, valPreference = ["random"], minKeyValPairs = 1, maxKeyValPairs = 10) {
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
      const keyVals = keyValPairs || this.number(minKeyValPairs, maxKeyValPairs);
      let keyValCount = 0;
      while (keyValCount < keyVals) {
        let key = this.string(1,6, false, "lower");
        let val = generate.random();
        result[key] = val;
        keyValCount++
      };
    }
    return result;
  },
  //generate array of values, randomized by default
  array: function(maxLength = 10, valTypes = ["random"], templateArray) {
    maxLength = maxLength || this.number(0, 10);
    if (templateArray && !Array.isArray(templateArray)) {
      console.error("Invalid templateArray: Not an array.")
    }
    let arr = templateArray || [];
    while(arr.length < maxLength) {
      let valType = valTypes.length > 1 ? this.number(0,valTypes.length) : valTypes[0]
      arr.push(generate[valType]());
    }
    return arr;
  }
}

module.exports = generator;