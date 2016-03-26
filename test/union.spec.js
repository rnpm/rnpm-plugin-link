const chai = require('chai');
const expect = chai.expect;
const union = require('../src/union');

describe('union', () => {

  it('should return unique list of items in all arrays', () => {
    const arrayOne = ['FontB.ttf', 'FontC.ttf', 'FontC.ttf'];
    const arrayTwo = ['FontA.ttf', 'FontC.ttf', 'FontD.ttf', 'FontD.ttf'];
    expect(
      union([arrayOne, arrayTwo])
    ).to.deep.equals(
      ['FontB.ttf', 'FontC.ttf', 'FontA.ttf', 'FontD.ttf']
    );
  });

});
