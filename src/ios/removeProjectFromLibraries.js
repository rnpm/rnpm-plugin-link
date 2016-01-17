/**
 * Given an array of xcodeproj libraries and pbxFile,
 * it removes it from that group by comparing fileRefs
 */
module.exports = function removeProjectFromLibraries(libraries, file) {
  return libraries.children.filter(file => file.value !== file.fileRef);
};
