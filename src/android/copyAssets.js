const fs = require('fs-extra');
const utils = require('../utils');
const path = require('path');

/**
 * Copies each file from an array of assets provided to targetPath directory
 *
 * For now, the only types of files that are handled are:
 * - Fonts (otf, ttf) - copied to targetPath/fonts under original name
 */
module.exports = function copyAssetsAndroid(files, targetPath) {
  const assets = utils.groupByType(files);

  (assets.font || []).forEach(asset => {
    const fileName = path.basename(asset);
    fs.copySync(
      asset,
      path.join(targetPath, 'fonts', fileName)
    );
  });
};
