const chai = require('chai');
const expect = chai.expect;
const utils = require('../src/utils');

describe('groupFilesByType', () => {

  it('should group files by its type', () => {
    const files = [
      'fonts/a.ttf',
      'fonts/b.ttf',
      'images/a.jpg',
      'images/c.jpeg'
    ];

    const groupedFiles = utils.groupByType(files);

    expect(groupedFiles.font).to.contain('fonts/a.ttf');
    expect(groupedFiles.image).to.contain('images/a.jpg');
  });

});
