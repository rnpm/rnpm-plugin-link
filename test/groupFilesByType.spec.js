const chai = require('chai');
const expect = chai.expect;
const groupFilesByType = require('../src/groupFilesByType');

describe('groupFilesByType', () => {

  it('should group files by its type', () => {
    const files = [
      'fonts/a.ttf',
      'fonts/b.ttf',
      'images/a.jpg',
      'images/c.jpeg',
    ];

    const groupedFiles = groupFilesByType(files);

    expect(groupedFiles.font).to.contain('fonts/a.ttf');
    expect(groupedFiles.image).to.contain('images/a.jpg');
  });

});
