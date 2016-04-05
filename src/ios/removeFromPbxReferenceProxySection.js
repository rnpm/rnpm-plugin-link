module.exports = function removeFromPbxReferenceProxySection(project, file) {
  const section = project.hash.project.objects.PBXReferenceProxy;

  for (var key of Object.keys(section)) {
    if (section[key].path === file.basename) {
      delete section[key];
    }
  }

  return;
};
