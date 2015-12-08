const chai = require('chai');
const expect = chai.expect;
const xcode = require('xcode');
const addToHeaderSearchPaths = require('../../src/ios/addToHeaderSearchPaths');
const lastItem = require('../../src/lastItem');

const project = xcode.project('test/fixtures/project.pbxproj');
const reactPath = '"$(SRCROOT)/../node_modules/react-native/React/**"';

const getHeaderSearchPaths = (config) =>
  Object.keys(config)
    .filter(ref => ref.indexOf('_comment') === -1)
    .map(ref => config[ref].buildSettings.HEADER_SEARCH_PATHS)
    .filter(paths => paths);

describe('ios::addToHeaderSearchPaths', () => {

  beforeEach(() => {
    project.parseSync();
  });

  it('should add path to settings that already have `react` added', () => {
    const path = '../../node_modules/path-to-module/**';
    addToHeaderSearchPaths(project, path);

    const config = project.pbxXCBuildConfigurationSection();

    getHeaderSearchPaths(config).forEach(paths => {
      if (paths.indexOf(reactPath)) {
        expect(lastItem(paths)).to.equals(path);
      } else {
        expect(paths).not.to.contain(path);
      }
    });
  });

});
