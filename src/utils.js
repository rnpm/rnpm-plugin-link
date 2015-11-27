const groupBy = require('lodash.groupby');
const mime = require('mime');

/**
 * Since there are no officialy registered MIME types
 * for ttf/otf yet http://www.iana.org/assignments/media-types/media-types.xhtml,
 * we define two non-standard ones for the sake of parsing
 */
mime.define({
  'font/opentype': ['otf'],
  'font/truetype': ['ttf'],
});

exports.groupByType = function groupByType(assets) {
  return groupBy(assets, type => mime.lookup(type).split('/')[0]);
};
