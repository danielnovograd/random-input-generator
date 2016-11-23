const {expect, assert} = require('chai');
const generator = require('../index.js');

describe('Numbers', () => {
  let randomNum;
  describe('Default Random Numbers', () => {
    beforeEach(() => {
      randomNum = generator.number()
    });
    it('should return a random number to return a number by default', () => {
      expect(randomNum).to.be.a('number');
    });
    it('should return a random number between 0 and 10000 by default', () => {
      expect(randomNum).to.be.above(0);
      expect(randomNum).to.be.below(10000);
    })
  })
})

