const path = require('path');

module.exports = function makeSettingsPatch(name, dependencyConfig, projectConfig) {
  const relative = path.relative(
    path.dirname(projectConfig.settingsGradlePath),
    dependencyConfig.sourceDir
  ).replace(/\\/g, '/');

  /*
   * Fix for Windows
   * Backslashes is the escape character and will result in an invalid path in settings.gradle
   * https://github.com/rnpm/rnpm/issues/113
   */
  const relativePlatform = process.platform === 'win32' ? relative.replace(/\\/g, '/') : relative;

  /**
   * Replace pattern by patch in the passed content
   * @param  {String} content Content of the Settings.gradle file
   * @return {String}         Patched content of Settings.gradle
   */
  return function applySettingsPatch(content) {
    const patch = `include ':${name}'\n` +
      `project(':${name}').projectDir = ` +
      `new File(rootProject.projectDir, '${relativePlatform}')`;

    return `${content.trim()}\n${patch}\n`;
  };
};
