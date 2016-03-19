const chai = require('chai');
const expect = chai.expect;
const dedupeAssets = require('../src/dedupeAssets');

describe('dedupeAssets', () => {

  it('should remove duplicated assets', () => {
    const assets = ['Fonts/FontB.ttf', 'Fonts/FontB.ttf', 'Fonts/FontA.ttf'];
    expect(dedupeAssets(assets)).to.deep.equals(['Fonts/FontB.ttf', 'Fonts/FontA.ttf']);
  });

});
