/**
 * Given an array of xcodeproj libraries and pbxFile,
 * it appends it to that group
 */
module.exports = function addProjectToLibraries(libraries, file) {
  return libraries.children.push({
    value: file.fileRef,
    comment: file.basename,
  });
};
