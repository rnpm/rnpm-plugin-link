module.exports = function removeFromProjectReferences(project, file) {
  const firstProject = project.getFirstProject().firstProject;

  firstProject.projectReferences = firstProject.projectReferences.filter(
    item => item.ProjectRef !== file.uuid
  );
};
