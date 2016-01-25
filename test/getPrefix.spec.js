const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const mock = require('mock-require');
const getPrefix = require('../src/android/getPrefix');

describe('getPrefix', () => {
  it('require a specific patch for react-native < 0.18', () => {
    mock('node_modules/react-native/package.json', {
      version: '0.17.0',
    });

    expect(getPrefix({ folder: '.' })).to.be.equal('patches/0.17');
  });

  it('require a specific patch for react-native > 0.18', () => {
    mock('node_modules/react-native/package.json', {
      version: '0.18.0',
    });

    expect(getPrefix({ folder: '.' })).to.be.equal('patches/0.18');
  });

  afterEach(() => {
    mock.stopAll();
  });

});
