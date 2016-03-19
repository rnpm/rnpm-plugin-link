module.exports = function getBuildProperty(project, prop) {
  const target = project.getFirstTarget().firstTarget;
  const config = project.pbxXCConfigurationList()[target.buildConfigurationList];
  const buildSection = project.pbxXCBuildConfigurationSection()[config.buildConfigurations[0].value];

  return buildSection.buildSettings[prop];
};
