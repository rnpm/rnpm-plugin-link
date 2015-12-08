const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const mock = require('mock-require');
const log = require('npmlog');
const path = require('path');

const link = (config, args) => require('../src/link')(config, args || []);

log.level = 'silent';

describe('link', () => {

  beforeEach(() => {
    delete require.cache[require.resolve('../src/link')];
  });

  // that test suite has to be changed in next PR so we have
  // fixed behaviour for `getProjectConfig` that's already in master
  it('should return when run in a folder without package.json', () => {
    const spy = sinon.spy(log, 'error');

    const config = {
      getProjectConfig: () => null,
    };

    link(config);

    expect(spy.calledWith('ERRPACKAGEJSON')).to.be.true;
  });

  it('should accept a name of a dependency to link', () => {
    const config = {
      getProjectConfig: () => ({}),
      getDependencyConfig: sinon.stub().returns({}),
    };

    link(config, ['react-native-gradient']);

    expect(
      config.getDependencyConfig.calledWith('react-native-gradient')
    ).to.be.true;
  });

  it('should read dependencies from package.json when name not provided', () => {
    const config = {
      getProjectConfig: () => ({}),
      getDependencyConfig: sinon.stub().returns({}),
    };

    mock(
      path.join(process.cwd(), 'package.json'),
      {
        dependencies: {
          'react-native-test': '*',
        },
      }
    );

    link(config);

    expect(
      config.getDependencyConfig.calledWith('react-native-test')
    ).to.be.true;
  });

  it('should register native module when android/ios projects are present', () => {
    const registerNativeModule = sinon.stub();
    const config = {
      getProjectConfig: () => ({ android: {}, ios: {} }),
      getDependencyConfig: sinon.stub().returns({ android: {}, ios: {} }),
    };

    mock(
      '../src/android/registerNativeModule.js',
      registerNativeModule
    );

    mock(
      '../src/ios/registerNativeModule.js',
      registerNativeModule
    );

    link(config, ['react-native-blur']);

    expect(registerNativeModule.calledTwice).to.be.true;
  });

  it('should copy assets from dependency project', () => {
    const copyAssets = sinon.stub();
    const assets = ['Fonts/Font.ttf'];
    const config = {
      getProjectConfig: () => ({ ios: {} }),
      getDependencyConfig: sinon.stub().returns({ assets }),
    };

    mock(
      '../src/ios/copyAssets.js',
      copyAssets
    );

    link(config, ['react-native-blur']);

    expect(copyAssets.calledOnce).to.be.true;
    expect(copyAssets.calledWith(assets)).to.be.true;
  });

  afterEach(() => {
    mock.stopAll();
  });

});
