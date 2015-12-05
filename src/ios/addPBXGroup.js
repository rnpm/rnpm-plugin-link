
const getMainGroup = (project) => {
  const projectSection = project.pbxProjectSection();
  const projectId = Object.keys(projectSection)[0];

  return project.hash.project.objects.PBXGroup[
   projectSection[projectId].mainGroup
  ];
};

const addGroupToProject = (project, group, uuid) => {
  const groups = project.hash.project.objects.PBXGroup;
  groups[uuid] = group;
  groups[`${uuid}_comment`] = group.name;
};

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
