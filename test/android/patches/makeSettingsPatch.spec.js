const fs = require('fs');
const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const makeSettingsPatch = require('../../../src/android/patches/makeSettingsPatch');

const name = 'test';
const projectConfig = { sourceDir: '.' };
const dependencyConfig = { sourceDir: `../node_modules/${name}/android` };
const settingsGradle = fs.readFileSync(
  path.join(process.cwd(), 'test/fixtures/android/settings.gradle'),
  'utf-8'
);
const patchedSettingsGradle = fs.readFileSync(
  path.join(process.cwd(), 'test/fixtures/android/patchedSettings.gradle'),
  'utf-8'
);

describe('makeSettingsPatch', () => {
  it('should build a patch function', () => {
    expect(
      makeSettingsPatch(name, dependencyConfig, projectConfig)
    ).to.be.a('function');
  });

  it('should make a correct patch', () => {
    const patch = makeSettingsPatch('test', dependencyConfig, projectConfig);
    expect(patch(settingsGradle)).to.be.equal(patchedSettingsGradle);
  });
});
