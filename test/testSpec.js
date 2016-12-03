const {expect, assert} = require('chai');
const generator = require('../index.js');
const { number, string } = generator;
const { fnRunner } = require('./test_helpers.js');

describe('Numbers (.number)', () => {
  let randomNum;
  describe('Default Random Numbers', () => {
    beforeEach(() => {
      randomNum = generator.number();
    });
    it('should return a number by default', () => {
      expect(randomNum).to.be.a('number');
    });
    it('should return a random number between 0 and 10000 by default', () => {
      expect(randomNum).to.be.above(0);
      expect(randomNum).to.be.below(10000);
    });
    it('should not throw an error with default parameters', () => {
      let defaultNumRun = fnRunner(generator.number);
      expect(defaultNumRun).to.not.throw();
    });
  });
  describe('Random Numbers with Range', () => {
    it('should never return a number outside of specified range', () => {
      let counter = 1000;
      let withinRange = true;
      while(counter) {
        let randomNumber = generator.number(50,60);
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
        let randomNumber = generator.number(-50, 0);
        if (randomNumber > 0) {
          allNegative = false;
        }
        counter--;
      }
      expect(allNegative).to.equal(true);
    });
    it('should throw an error for invalid arguments (max less than min)', () => {
      let invalidArgFn = fnRunner(generator.number, 10, 2);
      expect(invalidArgFn).to.throw();
    });
  });
});

describe('Strings (.string)', () => {
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
        randomStr = generator.string()
        expect(generator.enforceCase(randomStr, "upper")).to.equal(randomStr.toUpperCase());
        expect(generator.enforceCase(randomStr, "lower")).to.equal(randomStr.toLowerCase());
      });
    });
    describe('.isNonLetterCode', () => {
      beforeEach(function() {
        randomStr = generator.string();
      });
      it('should return true for character codes less than 65', () => {
        let isNonLetter = generator.isNonLetterCode(number(0,64));
        expect(isNonLetter).to.equal(true);
      });
      it('should return true for character codes between 91 and 96', () => {
        let isNonLetter = generator.isNonLetterCode(number(91,96));
        expect(isNonLetter).to.equal(true);
      });
      it('should return true for character codes greater than 122', () => {
        let isNonLetter = generator.isNonLetterCode(number(122,Infinity));
        expect(isNonLetter).to.equal(true);
      });
      it('should return false for character codes greater between 65 and 90', () => {
        let isNonLetter = generator.isNonLetterCode(number(65,90));
        expect(isNonLetter).to.equal(false);
      });
      it('should return false for character codes greater between 65 and 90', () => {
        let isNonLetter = generator.isNonLetterCode(number(97, 122));
        expect(isNonLetter).to.equal(false);
      });
    });
    describe('.characterGen', () => {
      let randomChar;
      beforeEach(() => {
        randomChar = generator.characterGen();
      });
      it('should throw an error with invalid arguments', () => {
        let invalidArg1 = fnRunner(generator.characterGen, true, 130, true);
        let invalidArg2 = fnRunner(generator.characterGen, 35, false, false);
        let invalidArg3 = fnRunner(generator.characterGen, 35, 120, 999);
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
          let min = number(32,65);
          let max = number(66,127);
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
          let min = number(32,65);
          let max = number(66,127);
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
      randomStr = generator.string()
    });
    it('should be a function', () => {
      expect(generator.string).to.be.a('function');
    });
    it('should return a string', () => {
      expect(randomStr).to.be.a('string');
    });
    it('should return a string of proper length', () => {
      let counter = 1000;
      let validLength = true;
      while(counter) {
        let randomStr = generator.string();
        if (randomStr.length < 4 || randomStr.length > 12) {
          validLength = false;
        }
        counter--;
      }
      expect(validLength).to.equal(true);
    });
    it('should not throw an error with default parameters', () => {
      let defaultStrRun = fnRunner(generator.string.bind(generator));
      expect(defaultStrRun).to.not.throw()
    });
  });
  describe('Custom Random Strings', () => {
    it('should throw an error if given invalid arguments', () => {
      let invalidArg1 = fnRunner(generator.string, true, 10, true);
      let invalidArg2 = fnRunner(generator.string, 4, "max", false);
      let invalidArg3 = fnRunner(generator.string, 5, 8, 999);
      let invalidArg4 = fnRunner(generator.string, 2, 12, true, 400);
      let invalidArg5 = fnRunner(generator.string, -4, 12, false, "upper");
      let invalidArg6 = fnRunner(generator.string, 13, 12, true, "lower");
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
        let minLen = number(4,10);
        let maxLen = number(11,20);
        let string = generator.string(minLen, maxLen, true, "lower");
        let randomLength = string.length
        if (randomLength < minLen || randomLength > maxLen) {
          withinRange = false;
        };
        counter--;
      };
      expect(withinRange).to.equal(true);
    });
    it('should return a string of maxLength length when minLength === maxLength', () => {
      randomStr = generator.string(6,6);
      expect(randomStr.length).to.equal(6);
    });
    it('should enforce casing when argument is specified', () => {
      let randomStr1 = generator.string(4,20,false,"upper");
      let randomStr2 = generator.string(4,20,false,"lower");
      expect(randomStr1).to.equal(randomStr1.toUpperCase());
      expect(randomStr2).to.equal(randomStr2.toLowerCase());
    });
  });
});

describe('Booleans (true || false)', () => {
  it('generator.boolean should be a function', () => {
    expect(generator.boolean).to.be.a('function');
  });
  it('should need no arguments', () => {
    let validFunc = fnRunner(generator.boolean);
    expect(validFunc).to.not.throw();
  });
  it('should produce a boolean value', () => {
    let bool = generator.boolean();
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
        generator.boolean(80) ? truth++ : falsehood++;
        counter--;
      }
      truth > 775 ? blockTruth++ : blockFalse++;
      blockCount--;
    }
    expect(blockTruth).to.be.at.least(8);
  });
  it('should throw an error with invalid arguments', () => {
    let invalidFunc1 = fnRunner(generator.boolean, "boolean plz");
    let invalidFunc2 = fnRunner(generator.boolean, -5);
    let invalidFunc3 = fnRunner(generator.boolean, 200);
    expect(invalidFunc1).to.throw();
    expect(invalidFunc2).to.throw();
    expect(invalidFunc3).to.throw();
  })
});