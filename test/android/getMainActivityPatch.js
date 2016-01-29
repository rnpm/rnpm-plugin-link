const chai = require('chai');
const expect = chai.expect;
const getMainActivityPatch = require('../../src/android/patches/getMainActivityPatch');
const newReactPatch = require('../../src/android/patches/0.18/makeMainActivityPatch');
const oldReactPatch = require('../../src/android/patches/0.17/makeMainActivityPatch');

describe('getMainActivityPatch', () => {
  it('require a specific patch for react-native < 0.18', () => {
    expect(getMainActivityPatch('0.17.0-rc')).to.equals(oldReactPatch);
    expect(getMainActivityPatch('0.17.2')).to.equals(oldReactPatch);
  });

  it('require a specific patch for react-native > 0.18', () => {
    expect(getMainActivityPatch('0.19.0')).to.equals(newReactPatch);
    expect(getMainActivityPatch('0.19.0-rc')).to.equals(newReactPatch);
    expect(getMainActivityPatch('0.18.0-rc')).to.equals(newReactPatch);
    expect(getMainActivityPatch('0.18.2')).to.equals(newReactPatch);
  });
});
