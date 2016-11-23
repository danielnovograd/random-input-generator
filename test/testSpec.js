const {expect, assert} = require('chai');
const {number, string, object, array} = require('../index.js');
const { fnRunner } = require('./test_helpers.js');

describe('Numbers', () => {
  let randomNum;
  describe('Default Random Numbers', () => {
    beforeEach(() => {
      randomNum = number();
    });
    it('should return a random number to return a number by default', () => {
      expect(randomNum).to.be.a('number');
    });
    it('should return a random number between 0 and 10000 by default', () => {
      expect(randomNum).to.be.above(0);
      expect(randomNum).to.be.below(10000);
    });
    it('should not throw an error with default parameters', () => {
      let defaultNumRun = fnRunner(number);
      expect(defaultNumRun).to.not.throw(Error)
    });

  });
  describe('Random Numbers with Range', () => {
    it('should never return a number outside of specified range', () => {
      let counter = 1000;
      let withinRange = true;
      while(counter) {
        let randomNumber = number(50,60);
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
        let randomNumber = number(-50, 0);
        if (randomNumber > 0) {
          allNegative = false;
        }
        counter--;
      }
      expect(allNegative).to.equal(true)
    });
    it('should throw an error for invalid arguments (max less than min)', () => {
      let invalidArgFn = fnRunner(number, 10, 2);
      expect(invalidArgFn).to.throw('Invalid Arguments: min argument must be less than max');
    });
  });
});
