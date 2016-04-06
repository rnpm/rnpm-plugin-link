module.exports = function removeFromProjectReferences(project, file) {
  const firstProject = project.getFirstProject().firstProject;

  const projectRef = firstProject.projectReferences.find(item => item.ProjectRef === file.uuid);

  if (!projectRef) {
    return null;
  }

  firstProject.projectReferences.splice(
    firstProject.projectReferences.indexOf(projectRef),
    1
  );

  return projectRef;
};
