const chai = require('chai');
const expect = chai.expect;
const promiseWaterfall = require('../src/promiseWaterfall');

describe('promiseWaterfall', () => {

  it('should resolve with an array of task return values', (done) => {
    const tasks = [
      () => Promise.resolve(1),
      () => Promise.resolve(2),
    ];

    promiseWaterfall(tasks).then(res => {
      expect(res).to.be.an.array;
      expect(res[0]).to.equal(1);
      expect(res[1]).to.equal(2);
      done();
    });
  });

  it('should handle empty array', (done) => {
    promiseWaterfall([]).then(res => {
      expect(res).to.be.an.array;
      done();
    });
  });

  it('should resolve a value before chaining', (done) => {
    promiseWaterfall([() => 1, () => 2, () => 3]).then(res => {
      expect(res).to.deep.equal([1, 2, 3]);
      done();
    });
  });

});
