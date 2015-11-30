const chai = require('chai');
const expect = chai.expect;
const isEmpty = require('../src/isEmpty');

describe('isEmpty', () => {

  it('should return true if array is undefined', () => {
    expect(isEmpty()).to.be.true;
  });

  it('should return true if array has no items', () => {
    expect(isEmpty([])).to.be.true;
  });

  it('should return false if array has items inside', () => {
    expect(isEmpty([1, 2, 3])).to.be.false;
  });

});
