const path = require('path');

module.exports = function makeSettingsPatch(name, dependencyConfig, projectConfig) {
  const projectRoot = projectConfig.isFlat
    ? path.join(projectConfig.sourceDir, '..')
    : projectConfig.sourceDir;

  const relative = path.relative(projectRoot, dependencyConfig.sourceDir);

  /**
   * Replace pattern by patch in the passed content
   * @param  {String} content Content of the Settings.gradle file
   * @return {String}         Patched content of Settings.gradle
   */
  return function applySettingsPatch(content) {
    const pattern = `include ':app'`;
    const patch = `include ':${name}'\n` +
      `project(':${name}').projectDir = ` +
      `new File(rootProject.projectDir, '${relative}')`;

    return content.replace(pattern, `${pattern}\n${patch}`);
  };
};
