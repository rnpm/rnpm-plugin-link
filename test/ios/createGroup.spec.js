const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const xcode = require('xcode');
const createGroup = require('../../src/ios/createGroup');
const lastItem = require('../../src/lastItem');

const newGroup = {
  uuid: 'newGroup_ID',
  group: {},
};

const firstProject = {
  mainGroup: 'mainGroup_ID',
};

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
    const spy = sinon.spy(project, 'getPBXGroupByKey');
    const mainGroupId = project.getFirstProject().firstProject.mainGroup;

    const createdGroup = createGroup(project, 'Resources');

    expect(spy.calledWith(mainGroupId)).to.be.true;

    expect(
      lastItem(project.getPBXGroupByKey(mainGroupId).children).value
    ).to.equals(createdGroup.uuid);
  });

  it('should return newly created group', () => {
    expect(
      createGroup(project, 'Resources').group.name
    ).to.equals('Resources');
  });

});
