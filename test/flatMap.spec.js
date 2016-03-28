const chai = require('chai');
const expect = chai.expect;
const flatMap = require('../src/flatMap');

describe('flatMap', () => {

  it('should return flattened array', () => {
    const items = [{ assets: ['FontA.ttf'] }, { assets: ['FontB.ttf'] }];

    expect(flatMap(items, item => item.assets)).to.deep.equals(['FontA.ttf', 'FontB.ttf']);
  });

});
