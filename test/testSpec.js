const {expect, assert} = require('chai');
const generator = require('../index.js');
const { number, string } = generator;
const { fnRunner } = require('./test_helpers.js');

describe('Numbers', () => {
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
      expect(defaultNumRun).to.not.throw()
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
      expect(withinRange).to.equal(true)
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
      expect(allNegative).to.equal(true)
    });
    it('should throw an error for invalid arguments (max less than min)', () => {
      let invalidArgFn = fnRunner(generator.number, 10, 2);
      expect(invalidArgFn).to.throw();
    });
  });
});

describe('Strings', () => {
  let randomStr;
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
  describe('Custom Random Strings',() => {
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
          expect(generator.enforceCase(randomStr, "upper")).to.equal(randomStr.toUpperCase());
          expect(generator.enforceCase(randomStr, "lower")).to.equal(randomStr.toLowerCase());
        });
      });
      describe('.isNonLetterCode', () => {
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
    });
  });
});