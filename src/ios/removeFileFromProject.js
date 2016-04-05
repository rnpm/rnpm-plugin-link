const PbxFile = require('xcode/lib/pbxFile');
const removeFromPbxItemContainerProxySection = require('./removeFromPbxItemContainerProxySection');

/**
 * Given xcodeproj and filePath, it creates new file
 * from path provided and removes it. That operation is required since
 * underlying method requires PbxFile instance to be passed (it does not
 * have to have uuid or fileRef defined since it will do equality check
 * by path)
 *
 * Returns removed file (that one will have UUID)
 */
module.exports = function removeFileFromProject(project, filePath) {
  const file = project.removeFromPbxFileReferenceSection(new PbxFile(filePath));
  removeFromPbxItemContainerProxySection(project, file);
  return file;
};
