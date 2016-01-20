const chai = require('chai');
const expect = chai.expect;
const xcode = require('xcode');
const pbxFile = require('xcode/lib/pbxFile');
const addFileToProject = require('../../src/ios/addFileToProject');
const removeFileFromProject = require('../../src/ios/removeFileFromProject');

const project = xcode.project('test/fixtures/project.pbxproj');
const filePath = '../fixtures/linearGradient.pbxproj';

describe('ios::addFileToProject', () => {

  beforeEach(() => {
    project.parseSync();
    addFileToProject(project, filePath);
  });

  it('should return removed file', () => {
    expect(removeFileFromProject(project, filePath)).to.be.instanceof(pbxFile);
  });

  it('should remove file from a project', () => {
    const file = removeFileFromProject(project, filePath);
    expect(project.pbxFileReferenceSection()).to.not.include.keys(file.fileRef);
  });

});
