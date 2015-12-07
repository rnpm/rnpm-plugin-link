const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const xcode = require('xcode');
const createGroup = require('../../src/ios/createGroup');
const lastItem = require('../../src/lastItem');

describe('ios::createGroup', () => {

  const project = xcode.project('test/fixtures/project.pbxproj');

  beforeEach(() => {
    project.parseSync();
  });

  it('should create a group with given name', () => {
    const spy = sinon.spy(project, 'pbxCreateGroup');

    createGroup(project, 'Resources');

    expect(spy.calledWith('Resources', '""')).to.be.true;
  });

  it('should attach group to main project group', () => {
    const mainGroupId = project.getFirstProject().firstProject.mainGroup;
    const createdGroup = createGroup(project, 'Resources');
    const mainGroup = project.getPBXGroupByKey(mainGroupId);

    expect(
      lastItem(mainGroup.children).value
    ).to.equals(createdGroup.uuid);
  });

  it('should return newly created group', () => {
    expect(
      createGroup(project, 'Resources').group.name
    ).to.equals('Resources');
  });

});
