const chai = require('chai');
const expect = chai.expect;
const lastItem = require('../src/lastItem');

describe('lastItem', () => {

  it('should return undefined if array is undefined', () => {
    expect(lastItem()).to.be.undefined;
  });

  it('should return undefined if array is empty', () => {
    expect(lastItem([])).to.be.undefined;
  });

  it('should return last item from an array', () => {
    expect(lastItem([1, 2, 3])).to.equal(3);
  });

});
