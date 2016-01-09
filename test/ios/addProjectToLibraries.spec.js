const chai = require('chai');
const expect = chai.expect;
const xcode = require('xcode');
const addProjectToLibraries = require('../../src/ios/addProjectToLibraries');

const project = xcode.project('test/fixtures/project.pbxproj');

describe('ios::addProjectToLibraries', () => {

  beforeEach(() => {
    project.parseSync();
  });

  it.skip('should append file to Libraries group', () => {

  });

});
