const getFirstProject = (project) => project.getFirstProject().firstProject;

const findGroup = (group, name) => group.children.find(group => group.comment === name);

/**
 * Returns group from .xcodeproj if one exists, null otherwise
 *
 * Unlike node-xcode `pbxGroupByName` - it does not return `first-matching`
 * group if multiple groups with the same name exist
 */
module.exports = function getGroup(project, path) {
  const firstProject = getFirstProject(project);
  const names = path.split('/');

  var group = project.getPBXGroupByKey(firstProject.mainGroup);

  for (var name of names) {
    var foundGroup = findGroup(group, name);

    if (foundGroup) {
      group = project.getPBXGroupByKey(foundGroup.value);
    } else {
      group = null;
      break;
    }
  }

  return group;
};
