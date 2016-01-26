const fs = require('fs');
const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const makeBuildPatch = require('../../../src/android/patches/makeBuildPatch');

const name = 'test';
const buildGradle = fs.readFileSync(
  path.join(process.cwd(), 'test/fixtures/android/build.gradle'),
  'utf-8'
);
const patchedBuildGradle = fs.readFileSync(
  path.join(process.cwd(), 'test/fixtures/android/patchedBuild.gradle'),
  'utf-8'
);

describe('makeBuildPatch', () => {
  it('should build a patch function', () => {
    expect(makeBuildPatch(name)).to.be.a('function');
  });

  it('should make a correct patch', () => {
    const patch = makeBuildPatch('test');
    expect(patch(buildGradle)).to.be.equal(patchedBuildGradle);
  });
});
