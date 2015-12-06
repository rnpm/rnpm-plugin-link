const getFirstProject = require('./getFirstProject');

module.exports = function createGroup(project, name) {
  const uuid = project.pbxCreateGroup(name, '""');

  const firstProject = getFirstProject(project);

  project.getPBXGroupByKey(firstProject.mainGroup).children.push({
    value: uuid,
    comment: name,
  });

  return project.pbxGroupByName(name);
};
