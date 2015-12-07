const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const createGroup = require('../../src/ios/createGroup');

const newGroup = {
  uuid: 'newGroup_ID',
  group: {},
};

const firstProject = {
  mainGroup: 'mainGroup_ID',
};

describe('ios::createGroup', () => {

  beforeEach(() => {
    project = {
      pbxCreateGroup: sinon.stub().returns(newGroup.uuid),
      getFirstProject: sinon.stub().returns({firstProject}),
      getPBXGroupByKey: sinon.stub().returns({children: []}),
      pbxGroupByName: sinon.stub().returns(newGroup),
    };
  });

  it('should create a group with given name', () => {
    createGroup(project, 'Resources');
    expect(
      project.pbxCreateGroup.calledWith('Resources', '""')
    ).to.be.true;
  });

  it('should attach group to main project group', () => {
    createGroup(project, 'Resources');

    expect(
      project.getPBXGroupByKey.calledWith('mainGroup_ID')
    ).to.be.true;

    expect(
      project.getPBXGroupByKey.returnValues[0].children.length
    ).to.equals(1);
  });

  it('should return newly created group', () => {
    expect(createGroup(project, 'Resources')).to.equals(newGroup);
  });

});
