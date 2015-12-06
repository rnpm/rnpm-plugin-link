/**
 * Given xcode project, returns first project from its `PBXProject`
 * section.
 */
module.exports = function getFirstProject(project) {
  const projectSection = project.pbxProjectSection();
  const projectId = project.getFirstProject().uuid;
  return projectSection[projectId];
};
