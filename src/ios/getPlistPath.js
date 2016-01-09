module.exports = function getPlistPath(project) {
  return project.getBuildProperty('INFOPLIST_FILE')
    .replace(/"/g, '')
    .replace('$(SRCROOT)', '');
};
