const getGroup = require('./getGroup');

const hasGroup = (pbxGroup, name) => pbxGroup.children.find(group => group.comment === name);

/**
 * Given project and name of the group, creates a new top-level group,
 * that is then - added to `mainGroup` so that it's visible as a top-level
 * folder in your Xcode sidebar
 *
 * Returns newly created group
 */
module.exports = function createGroup(project, path) {
  return path.split('/').reduce(
    (group, name) => {
      if (!hasGroup(group, name)) {
        const uuid = project.pbxCreateGroup(name, '""');

        group.children.push({
          value: uuid,
          comment: name,
        });
      }

      return project.pbxGroupByName(name);
    },
    getGroup(project)
  );
};
