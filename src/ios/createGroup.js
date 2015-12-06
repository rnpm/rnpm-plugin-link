const getFirstProject = (project) => project.getFirstProject().firstProject;

/**
 * Given project and name of the group, creates a new top-level group,
 * that is then - added to `mainGroup` so that it's visible as a top-level
 * folder in your Xcode sidebar
 *
 * Returns newly created group
 */
module.exports = function createGroup(project, name) {
  const uuid = project.pbxCreateGroup(name, '""');

  const firstProject = getFirstProject(project);

  project
    .getPBXGroupByKey(firstProject.mainGroup)
    .children
    .push({
      value: uuid,
      comment: name,
    });

  return project.pbxGroupByName(name);
};
