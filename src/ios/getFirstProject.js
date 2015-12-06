/**
 * Gets main project group that represents what you usually
 * see in your left-side panel.
 *
 * This is done by accessing `PBXProjectSection` that
 * by the `xcode` library design returns an object with keys:
 * `uuid` & `uuid_comment`. We only access the first key in the array
 * (just like `xcode` internally) and return that group details from `PBXGroup`
 * section.
 */
module.exports = function getMainGroup(project) {
  const projectSection = project.pbxProjectSection();
  const projectId = project.getFirstProject().uuid;
  return projectSection[projectId];
};
