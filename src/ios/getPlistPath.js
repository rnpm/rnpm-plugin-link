/**
 * Returns path to Info.plist located in the iOS project and removes
 * xcode $(SRCROOT) and other implementation specific decorators, so that
 * return value can be easily used in e.g. path.join calls
 *
 * Returns `null` if INFOPLIST_FILE is not specified.
 */
module.exports = function getPlistPath(project) {
  const target = project.getFirstTarget().firstTarget;
  const config = project.pbxXCConfigurationList()[target.buildConfigurationList];
  const buildSection = project.pbxXCBuildConfigurationSection()[config.buildConfigurations[0].value];

  const plistFile = buildSection.buildSettings.INFOPLIST_FILE;

  if (!plistFile) {
    return null;
  }

  return plistFile
    .replace(/"/g, '')
    .replace('$(SRCROOT)', '');
};
