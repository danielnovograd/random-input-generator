const { expect, assert } = require('chai');
const generator = require('../index.js');
const { fnRunner } = require('./test_helpers.js');
const { generateNumber, generateString, generateBoolean, generateObject, generateArray, defaultGenerator } = generator;

describe('Numbers (generateNumber)', () => {
  let randomNum;
  describe('Default Random Numbers', () => {
    beforeEach(() => {
      randomNum = generateNumber();
    });
    it('should return a number by default', () => {
      expect(randomNum).to.be.a('number');
    });
    it('should return a random number between 0 and 10000 by default', () => {
      expect(randomNum).to.be.above(0);
      expect(randomNum).to.be.below(10000);
    });
    it('should not throw an error with default parameters', () => {
      let defaultNumRun = fnRunner(generateNumber);
      expect(defaultNumRun).to.not.throw();
    });
    it('should accept an argument for rounding', () => {
      expect(randomNum).to.equal(Math.floor(randomNum));
      expect(generateNumber(10,20,false)).to.not.equal(Math.floor(randomNum));
    });
  });
  describe('Random Numbers with Range', () => {
    it('should never return a number outside of specified range', () => {
      let counter = 1000;
      let withinRange = true;
      while(counter) {
        let randomNumber = generateNumber(50,60);
        if (randomNumber < 50 || randomNumber > 60) {
          withinRange = false;
        }
        counter--;
      }
      expect(withinRange).to.equal(true);
    });
    it('should work with negative numbers for min and max', () => {
      let counter = 1000;
      let allNegative = true;
      while(counter) {
        let randomNumber = generateNumber(-50, 0);
        if (randomNumber > 0) {
          allNegative = false;
        }
        counter--;
      }
      expect(allNegative).to.equal(true);
    });
    it('should throw an error for invalid arguments (max less than min)', () => {
      let invalidArgFn = fnRunner(generateNumber, 10, 2);
      expect(invalidArgFn).to.throw();
    });
  });
});

describe('Strings (generateString)', () => {
  let randomStr;
  describe('Random String Helpers', () => {
    describe('.enforceCase', () => {
      it('should throw an error if first argument is not a string', () => {
        let invalidTypeFn = fnRunner(generator.enforceCase, 3, "upper");
        expect(invalidTypeFn).to.throw();
      });
      it('should throw an error if casing argument is invalid', () => {
        let invalidTypeFn = fnRunner(generator.enforceCase, 3, "no-case");
        expect(invalidTypeFn).to.throw();
      });
      it('should enforce casing', () => {
        randomStr = generateString()
        expect(generator.enforceCase(randomStr, "upper")).to.equal(randomStr.toUpperCase());
        expect(generator.enforceCase(randomStr, "lower")).to.equal(randomStr.toLowerCase());
      });
    });
    describe('.isNonLetterCode', () => {
      beforeEach(function() {
        randomStr = generateString();
      });
      it('should return true for character codes less than 65', () => {
        let isNonLetter = generator.isNonLetterCode(generateNumber(0,64));
        expect(isNonLetter).to.equal(true);
      });
      it('should return true for character codes between 91 and 96', () => {
        let isNonLetter = generator.isNonLetterCode(generateNumber(91,96));
        expect(isNonLetter).to.equal(true);
      });
      it('should return true for character codes greater than 122', () => {
        let isNonLetter = generator.isNonLetterCode(generateNumber(122,Infinity));
        expect(isNonLetter).to.equal(true);
      });
      it('should return false for character codes greater between 65 and 90', () => {
        let isNonLetter = generator.isNonLetterCode(generateNumber(65,90));
        expect(isNonLetter).to.equal(false);
      });
      it('should return false for character codes greater between 65 and 90', () => {
        let isNonLetter = generator.isNonLetterCode(generateNumber(97, 122));
        expect(isNonLetter).to.equal(false);
      });
    });
    describe('.characterGen', () => {
      let randomChar;
      beforeEach(() => {
        randomChar = generator.characterGen();
      });
      it('should throw an error with invalid arguments', () => {
        let invalidArg1 = generator.characterGen.bind(null, true, 130, true);
        let invalidArg2 = generator.characterGen.bind(null, 35, false, false);
        let invalidArg3 = generator.characterGen.bind(null, 35, 120, 999);
        expect(invalidArg1).to.throw();
        expect(invalidArg2).to.throw();
        expect(invalidArg3).to.throw();
      });
      it('should return a string', () => {
        expect(randomChar).to.be.a('string');
      });
      it('should return a string with char code between 32 and 127 by default', () => {
        let charCode = generator.characterGen().charCodeAt(0);
        expect(charCode).to.be.below(128).and.above(31);
      });
      it('should never return charCode 92 (backslash - \\)', () => {
        let counter = 1000;
        let noBackslash = true;
        while(counter) {
          let char = generator.characterGen();
          if (char.charCodeAt(0) === 92) {
            noBackslash = false;
          };
          counter--;
        };
        expect(noBackslash).to.equal(true);
      });
      it('should not return a character out of the specified range', () => {
        let counter = 1000;
        let withinRange = true;
        while(counter) {
          let min = generateNumber(32,65);
          let max = generateNumber(66,127);
          let char = generator.characterGen(min, max, true);
          let generatedCharCode = char.charCodeAt(0)
          if (generatedCharCode < min || generatedCharCode > max) {
            withinRange = false;
          };
          counter--;
        };
        expect(withinRange).to.equal(true);
      });
      it('should return only one character', () => {
        let counter = 1000;
        let singleChar = true;
        while(counter) {
          let min = generateNumber(32,65);
          let max = generateNumber(66,127);
          let char = generator.characterGen(min, max, true);
          if (char.length !== 1) {
            singleChar = false;
          };
          counter--;
        };
        expect(singleChar).to.equal(true);
      });
    });
  });
  describe('Default Random Strings', () => {
    beforeEach(function() {
      randomStr = generateString()
    });
    it('should be a function', () => {
      expect(generateString).to.be.a('function');
    });
    it('should return a string', () => {
      expect(randomStr).to.be.a('string');
    });
    it('should return a string of proper length', () => {
      let counter = 1000;
      let validLength = true;
      while(counter) {
        let randomStr = generateString();
        if (randomStr.length < 4 || randomStr.length > 12) {
          validLength = false;
        }
        counter--;
      }
      expect(validLength).to.equal(true);
    });
    it('should not throw an error with default parameters', () => {
      expect(generateString).to.not.throw()
    });
  });
  describe('Custom Random Strings', () => {
    it('should throw an error if given invalid arguments', () => {
      let invalidArg1 = generateString.bind(null, true, 10, true);
      let invalidArg2 = generateString.bind(null, 4, "max", false);
      let invalidArg3 = generateString.bind(null, 5, 8, 999);
      let invalidArg4 = generateString.bind(null, 2, 12, true, 400);
      let invalidArg5 = generateString.bind(null, -4, 12, false, "upper");
      let invalidArg6 = generateString.bind(null, 13, 12, true, "lower");
      expect(invalidArg1).to.throw();
      expect(invalidArg2).to.throw();
      expect(invalidArg3).to.throw();
      expect(invalidArg4).to.throw();
      expect(invalidArg5).to.throw();
      expect(invalidArg6).to.throw();
    });
    it('should return a string within the specified range', () => {
      let counter = 1000;
      let withinRange = true;
      while(counter) {
        let minLen = generateNumber(4,10);
        let maxLen = generateNumber(11,20);
        let string = generateString(minLen, maxLen, true, "lower");
        let randomLength = string.length
        if (randomLength < minLen || randomLength > maxLen) {
          withinRange = false;
        };
        counter--;
      };
      expect(withinRange).to.equal(true);
    });
    it('should return a string of maxLength length when minLength === maxLength', () => {
      randomStr = generateString(6,6);
      expect(randomStr.length).to.equal(6);
    });
    it('should enforce casing when argument is specified', () => {
      let randomStr1 = generateString(4,20,false,"upper");
      let randomStr2 = generateString(4,20,false,"lower");
      expect(randomStr1).to.equal(randomStr1.toUpperCase());
      expect(randomStr2).to.equal(randomStr2.toLowerCase());
    });
  });
});

describe('Booleans (generateBoolean)', () => {
  it('generator.boolean should be a function', () => {
    expect(generateBoolean).to.be.a('function');
  });
  it('should need no arguments', () => {
    expect(generateBoolean).to.not.throw();
  });
  it('should produce a boolean value', () => {
    let bool = generateBoolean();
    expect(bool).to.be.a('boolean');
  });
  it('should properly weight probability with argument', () => {
    let blockCount = 100,
        blockTruth = 0,
        blockFalse = 0,
        counter = 1000;
    while(blockCount) {
      let truth = 0,
      falsehood = 0;
      counter = 1000;
      while (counter) {
        //weight for 80% true
        generateBoolean(80) ? truth++ : falsehood++;
        counter--;
      }
      truth > 775 ? blockTruth++ : blockFalse++;
      blockCount--;
    }
    expect(blockTruth).to.be.at.least(8);
  });
  it('should throw an error with invalid arguments', () => {
    let invalidFunc1 = generateBoolean.bind(null, "boolean plz");
    let invalidFunc2 = generateBoolean.bind(null, -5);
    let invalidFunc3 = generateBoolean.bind(null, 200);
    expect(invalidFunc1).to.throw();
    expect(invalidFunc2).to.throw();
    expect(invalidFunc3).to.throw();
  })
});

describe('Objects (generateObject)', () => {
  let randomObject;
  describe('Default Random Object', () => {
    beforeEach(() => {
      randomObject = generateObject();
    });
    it('should be a function', () => {
      expect(generateObject).to.be.a('function');
    });
    it('should return an object', () => {
      expect(generateObject).to.not.throw();
      expect(randomObject).to.be.a('object');
    });
    it('should return an object with between 2 and 6 key-value pairs', () => {
      let keyValPairs = Object.keys(randomObject).length;
      expect(keyValPairs).to.be.at.least(2);
      expect(keyValPairs).to.be.at.most(6);
    });
  });
  describe('Custom Random Object', () => {
    describe('Configuration Object', () => {
      it('should throw an error without configuration object', () => {
        expect(generateObject.bind(null, "makeAnObject")).to.throw();
      });
    });
    describe('keyValPair parameter', () => {
      it('should generate object with exact keyValPairs', () => {
        expect(Object.keys(generateObject({keyValPairs: 3})).length).to.equal(3);
        expect(Object.keys(generateObject({keyValPairs: 5})).length).to.equal(5);
        expect(Object.keys(generateObject({keyValPairs: 20})).length).to.equal(20);
      });
    });
    describe('optionalSkeleton parameter',() => {
      it('should not allow a non-object value', () => {
        expect(generateObject.bind(null, {keyValPairs: 3, optionalSkeleton: "wrong"})).to.throw();
      });
      describe('optionalSkeletonArray', () => {
        let skeleton;
        beforeEach(() => {
          skeleton = ["dog", "cat", "fish"];
        });
        it('should accept valPreference arrays', () => {
          expect(generateObject.bind(null, {valPreference: ["string", "optional"]})).to.throw();
        })
       it('should allow an array as a skeleton object', () => {
          expect(generateObject.bind(null, {keyValPairs: 4, optionalSkeleton: skeleton})).to.not.throw();
          expect(generateObject.bind(null, {keyValPairs: 4, optionalSkeleton: [true]})).to.throw();
        });
        it('should produce an object with keys for each array element', () => {
          let generatedObject = generateObject({optionalSkeleton: skeleton});
          expect(Object.keys(generatedObject).every(key => skeleton.indexOf(key) > -1)).to.equal(true);
        });
        it('should throw an error with a keyValPairs parameter that is less than length of optionalSkeleton object keys', () => {
          let badConfig = {keyValPairs: 2, optionalSkeleton: {dog: true, cat: true, wombat: false}}
          expect(generateObject.bind(null, badConfig)).to.throw();
        });
        it('should allow keyValPairs parameter that is greater than length of optionalSkeleton object keys', () => {
          let goodConfig = {keyValPairs: 5, optionalSkeleton: {dog: true, cat: true, wombat: false}}
          expect(generateObject.bind(null, goodConfig)).to.not.throw();
        });
      });
    });
  });
});

describe('Arrays (generateArray', () => {
  let randomArray;
  describe('Default Random Array', () => {
    beforeEach(() => {
      randomArray = generateArray();
    });
    it('should be a function', () => {
      expect(generateArray).to.be.a('function');
      expect(generateArray).to.not.throw();
    });
    it('should return an array', () => {
      expect(randomArray).to.be.an('array');
    });
    it('should produce an array of length between 0 and 10', () => {
      expect(randomArray.length).to.be.at.least(0);
      expect(randomArray.length).to.be.at.most(10);
    });
  });
  describe('Custom Random array', () => {
    it('should throw an error for invalid parameters', () => {
      let wrongArray1 = generateArray.bind(null, {maxLength: "seven"});
      let wrongArray2 = generateArray.bind(null, 5, {valTypes: "boolean"});
      let wrongArray3 = generateArray.bind(null, { maxLength: 7, valTypes: ["random"], templateArray: null});
      let wrongArray4 = generateArray.bind(null, { setLength: "fourteen"});
      let wrongArray5 = generateArray.bind(null, { minLength: true});
      expect(wrongArray1).to.throw();
      expect(wrongArray2).to.throw();
      expect(wrongArray3).to.throw();
      expect(wrongArray4).to.throw();
      expect(wrongArray5).to.throw();
    });
    it('should be of defined length if setLength config provided', () => {
      expect(generateArray({setLength: 12}).length).to.equal(12);
    });
    it('should have length less than or equal to maxLength parameter', () => {
      expect(generateArray({maxLength: 4}).length).to.be.at.most(4);
    });
    it('should only contain values specified in valTypes parameter', () => {
      let randomArray = generateArray({maxLength: 10, valTypes: ["number", "string"]});
      expect(randomArray.every((value) => typeof value === "number" || typeof value === "string")).to.equal(true);
    });
    it('should allow template Arrays', () => {
      let randomArray2 = generateArray({maxLength: 8, templateArray: [1,2,5]});
      expect(randomArray2[0]).to.equal(1);
      expect(randomArray2[2]).to.equal(5);
      expect(randomArray2.length).to.be.at.most(8);
      expect(randomArray2.length).to.be.at.least(3);
    });
    describe('valueGenerator parameter', () => {
      it('should allow non-functions', () => {
        let randomArray = generateArray({maxLength: 10, valueGenerator: {username: "hello", password: "readyToCopy"}});
        expect(randomArray.every(obj => obj.username === "hello" && obj.password === "readyToCopy")).to.equal(true);
      });
      it('should allow functions for valueGenerators',() => {
        let randomArray = generateArray({maxLength: 6, valueGenerator: () => generateString(4,8, false)});
        expect(randomArray.every(val => typeof val === "string")).to.equal(true);
      });
    });
    describe('Depth Control', () => {
      it('should not exceed the maxDepth specified', () => {
        let randomArray = generateArray({valTypes: ["array", "object"]});
        let deepestDepth = 0;
        function depthTest(array, currentDepth) {
          if (currentDepth > deepestDepth) {
            deepestDepth = currentDepth;
            return;
          }
          for (var i = 0; i < array.length; i++) {
            if(Array.isArray(array[i])) {
              depthTest(array[i], currentDepth + 1);
            }
          }
        }
        depthTest(randomArray, 0);
        expect(deepestDepth).to.be.at.most(4);
      });
    });
  });
});

describe('Default Generator', () => {
  it('should generate a random value with default parameters', () => {
    expect(defaultGenerator.object()).to.be.a('object');
    expect(defaultGenerator.array()).to.be.a('array');
    expect(defaultGenerator.number()).to.be.a('number');
    expect(defaultGenerator.string()).to.be.a('string');
    expect(defaultGenerator.boolean()).to.be.a('boolean');
    expect(typeof defaultGenerator.random() in defaultGenerator).to.equal(true);
  });
});