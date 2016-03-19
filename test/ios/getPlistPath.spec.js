const chai = require('chai');
const expect = chai.expect;
const xcode = require('xcode');
const getPlistPath = require('../../src/ios/getPlistPath');

const project = xcode.project('test/fixtures/project.pbxproj');
const invalidProject = xcode.project('test/fixtures/projectWithoutPlist.pbxproj');

describe('ios::getPlistPath', () => {

  beforeEach(() => {
    project.parseSync();
    invalidProject.parseSync();
  });

  it('should return path without Xcode $(SRCROOT)', () => {
    const plistPath = getPlistPath(project);
    expect(plistPath).to.equals('Basic/Info.plist');
  });

  it('should return null when Info.plist is not set', () => {
    expect(getPlistPath(invalidProject)).to.equals(null);
  });

});
