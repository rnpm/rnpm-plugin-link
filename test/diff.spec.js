const chai = require('chai');
const expect = chai.expect;
const diff = require('../src/diff');

describe('diff', () => {

  it('should return difference between two arrays', () => {
    const baseArray = ['FontB.ttf', 'FontC.ttf', 'FontD.ttf'];
    const toExcludeArray = ['FontC.ttf', 'FontD.ttf'];

    expect(diff(baseArray, toExcludeArray)).to.deep.equals(['FontB.ttf']);
  });

});
