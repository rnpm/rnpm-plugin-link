const chai = require('chai');
const expect = chai.expect;
const groupBy = require('../src/groupBy');

describe('groupBy', () => {

  it('should group items by a given key', () => {
    const items = ['FontB.ttf', 'FontC.ttf', 'Image1.jpg'];
    const getKey = (item) => item.split('.')[1];

    expect(groupBy(items, getKey)).to.deep.equals({
      ttf: ['FontB.ttf', 'FontC.ttf'],
      jpg: ['Image1.jpg'],
    });
  });

});
