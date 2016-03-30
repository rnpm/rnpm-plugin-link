const chai = require('chai');
const expect = chai.expect;
const xcode = require('xcode');
const createGroup = require('../../src/ios/createGroup');
const last = require('lodash').last;

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
      last(mainGroup.children).value
    ).to.equals(createdGroup.uuid);
  });

  it.skip('should create a nested group with given path', () => {
    const createdGroup = createGroup(project, 'NewGroup/NewNestedGroup').group;
  });

  it.skip('should-not create already created groups', () => {
    const createdGroup = createGroup(project, 'Libraries/NewNestedGroup').group;
  });
});
