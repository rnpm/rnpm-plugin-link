/**
 * Given Xcode project and path, iterate over all build configurations
 * and append new path to HEADER_SEARCH_PATHS section
 *
 * We cannot use builtin addToHeaderSearchPaths method since react-native init does not
 * use $(TARGET_NAME) for PRODUCT_NAME, but sets it manually so that method will skip
 * that target.
 *
 * To workaround that issue and make it more bullet-proof for different names,
 * we iterate over all configurations and look if React is already there. If it is,
 * we assume user will need newly added dependency headers in it as well.
 */
module.exports = function addToHeaderSearchPaths(project, path) {
  const config = project.pbxXCBuildConfigurationSection();

  Object
    .keys(config)
    .filter(ref => ref.indexOf('_comment') === -1)
    .forEach(ref => {
      const buildSettings = config[ref].buildSettings;
      const shouldAddSearchPath = (buildSettings.HEADER_SEARCH_PATHS || [])
        .filter(path => path.indexOf('react-native/React/**'))
        .length > 0;

      if (shouldAddSearchPath) {
        buildSettings.HEADER_SEARCH_PATHS.push(path);
      }
    });
};
