const chai = require('chai');
const expect = chai.expect;
const xcode = require('xcode');
const getGroup = require('../../src/ios/getGroup');

const project = xcode.project('test/fixtures/project.pbxproj');

describe('ios::getGroup', () => {
  beforeEach(() => {
    project.parseSync();
  });

  it('should return a top-level group', () => {
    const group = getGroup(project, 'Libraries');
    expect(group.children.length > 0).to.be.true;
    expect(group.name).to.equals('Libraries');
  });

  it('should return nested group when specified', () => {
    const group = getGroup(project, 'NestedGroup/Libraries');
    expect(group.children.length).to.equals(0);
    expect(group.name).to.equals('Libraries');
  });
});
