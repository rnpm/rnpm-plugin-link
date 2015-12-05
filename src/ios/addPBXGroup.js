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
const getMainGroup = (project) => {
  const projectSection = project.pbxProjectSection();
  const projectId = Object.keys(projectSection)[0];

  return project.hash.project.objects.PBXGroup[
   projectSection[projectId].mainGroup
  ];
};

/**
 * Adds given project to the PBXGroup array
 * It's similar to `xcode.addPBXGroup` except it does not
 * force you to specify path nor files to add along the group.
 * What it does is just updating reference.
 */
const addGroupToProject = (project, group, uuid) => {
  const groups = project.hash.project.objects.PBXGroup;
  groups[uuid] = group;
  groups[`${uuid}_comment`] = group.name;
};

/**
 * Adds PBX Group to the project
 *
 * It differs from the `xcode` implementation in the way,
 * that it allows you to create an empty group w/o a path,
 * so it works just like any other virtual group created
 * by Xcode.
 *
 * Once group is created, it's attached to the project (added
 * to list of all groups just for the reference) and then,
 * added as a child to main project group, so it's visible from
 * your left-side panel.
 *
 * This steps are 100% compatible with natural Xcode approach.
 */
module.exports = function addPBXGroup(project, name) {
  const uuid = project.generateUuid();
  const group = {
    isa: 'PBXGroup',
    children: [],
    name: name,
    sourceTree: '"<group>"',
  };

  addGroupToProject(project, group, uuid);

  getMainGroup(project).children.push({
    value: uuid,
    comment: 'Resources',
  });

  return { uuid, group };
};
