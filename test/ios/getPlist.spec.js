const chai = require('chai');
const expect = chai.expect;
const xcode = require('xcode');
const getPlist = require('../../src/ios/getPlist');

const project = xcode.project('test/fixtures/project.pbxproj');

describe('ios::getPlistPath', () => {

  beforeEach(() => {
    project.parseSync();
  });

  it.skip('should return path without Xcode $(SRCROOT)', () => {
    const plistPath = getPlistPath(project);
    expect(plistPath).to.equals('Basic/Info.plist');
  });

});
