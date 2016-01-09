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
      getProjectConfig: () => {
        throw new Error('No package.json found');
      },
    };

    link(config);

    expect(spy.calledWith('ERRPACKAGEJSON')).to.be.true;
  });

  it('should accept a name of a dependency to link', () => {
    const config = {
      getProjectConfig: () => ({ assets: [] }),
      getDependencyConfig: sinon.stub().returns({ assets: [] }),
    };

    link(config, ['react-native-gradient']);

    expect(
      config.getDependencyConfig.calledWith('react-native-gradient')
    ).to.be.true;
  });

  it('should read dependencies from package.json when name not provided', () => {
    const config = {
      getProjectConfig: () => ({ assets: [] }),
      getDependencyConfig: sinon.stub().returns({ assets: [] }),
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
      getProjectConfig: () => ({ android: {}, ios: {}, assets: [] }),
      getDependencyConfig: sinon.stub().returns({ android: {}, ios: {}, assets: [] }),
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

  it('should copy assets from both project and dependencies projects', () => {
    const copyAssets = sinon.stub();
    const dependencyAssets = ['Fonts/Font.ttf'];
    const projectAssets = ['Fonts/FontC.ttf'];

    const config = {
      getProjectConfig: () => ({ ios: {}, assets: projectAssets }),
      getDependencyConfig: sinon.stub().returns({ assets: dependencyAssets }),
    };

    mock(
      '../src/ios/linkAssets.js',
      copyAssets
    );

    link(config, ['react-native-blur']);

    expect(copyAssets.calledOnce).to.be.true;
    expect(copyAssets.getCall(0).args[0]).to.deep.equals(
      projectAssets.concat(dependencyAssets)
    );
  });

  it('should remove duplicated assets before copying them', () => {
    const copyAssets = sinon.stub();
    const dependencyAssets = ['Fonts/FontB.ttf'];
    const projectAssets = ['Fonts/FontB.ttf', 'Fonts/FontA.ttf'];

    const config = {
      getProjectConfig: () => ({ ios: {}, assets: projectAssets }),
      getDependencyConfig: sinon.stub().returns({ assets: dependencyAssets }),
    };

    mock(
      '../src/ios/linkAssets.js',
      copyAssets
    );

    link(config, ['react-native-blur']);

    expect(copyAssets.calledOnce).to.be.true;
    expect(copyAssets.getCall(0).args[0]).to.deep.equals(projectAssets);
  });

  afterEach(() => {
    mock.stopAll();
  });

});
