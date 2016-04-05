module.exports = function removeFromPbxItemContainerProxySection(project, file) {
  const section = project.hash.project.objects.PBXContainerItemProxy;

  for (var key of Object.keys(section)) {
    if (section[key].containerPortal_comment === file.basename) {
      delete section[key];
    }
  }

  return;
};
