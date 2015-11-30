const chai = require('chai');
const expect = chai.expect;
const getHeaderSearchPath = require('../../src/ios/getHeaderSearchPath');
const path = require('path');

const SRC_DIR = path.join('react-native-project', 'ios');

describe('ios#getHeaderSearchPath', () => {

  it('should return correct path when all headers are in root folder', () => {
    const files = [
      path.join('react-native-project', 'node_modules', 'package', 'Gradient.h'),
      path.join('react-native-project', 'node_modules', 'package', 'Manager.h'),
    ];

    const searchPath = getHeaderSearchPath(SRC_DIR, files);

    expect(searchPath).to.equal(
      `"${['$(SRCROOT)', '..', 'node_modules', 'package'].join(path.sep)}"`
    );
  });

  it('should return correct path when headers are in multiple folders', () => {
    const files = [
      path.join('react-native-project', 'node_modules', 'package', 'src', 'folderA', 'Gradient.h'),
      path.join('react-native-project', 'node_modules', 'package', 'src', 'folderB', 'Manager.h'),
    ];

    const searchPath = getHeaderSearchPath(SRC_DIR, files);

    expect(searchPath).to.equal(
      `"${['$(SRCROOT)', '..', 'node_modules', 'package', 'src'].join(path.sep)}/**"`
    );
  });

  it('should return correct path when headers are in root and nested folders', () => {
    const files = [
      path.join('react-native-project', 'node_modules', 'package', 'src', 'folderA', 'Gradient.h'),
      path.join('react-native-project', 'node_modules', 'package', 'src', 'folderB', 'Manager.h'),
      path.join('react-native-project', 'node_modules', 'package', 'src', 'Manager.h'),
    ];

    const searchPath = getHeaderSearchPath(SRC_DIR, files);

    expect(searchPath).to.equal(
      `"${['$(SRCROOT)', '..', 'node_modules', 'package', 'src'].join(path.sep)}/**"`
    );
  });
});
