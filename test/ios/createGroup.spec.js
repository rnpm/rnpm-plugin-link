const chai = require('chai');
const expect = chai.expect;
const xcode = require('xcode');
const createGroup = require('../../src/ios/createGroup');
const lastItem = require('../../src/lastItem');

const project = xcode.project('test/fixtures/project.pbxproj');

describe('ios::createGroup', () => {

  beforeEach(() => {
    project.parseSync();
  });

  it('should create a group with given name', () => {
    const createdGroup = createGroup(project, 'Resources').group;
    expect(createdGroup.name).to.equals('Resources');
  });

  it('should attach group to main project group', () => {
    const mainGroupId = project.getFirstProject().firstProject.mainGroup;
    const createdGroup = createGroup(project, 'Resources');
    const mainGroup = project.getPBXGroupByKey(mainGroupId);

    expect(
      lastItem(mainGroup.children).value
    ).to.equals(createdGroup.uuid);
  });

});
