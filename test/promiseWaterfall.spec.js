const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const promiseWaterfall = require('../src/promiseWaterfall');

describe('promiseWaterfall', () => {

  it('should run promises in a sequence', (done) => {
    const tasks = [sinon.stub(), sinon.stub()];

    promiseWaterfall(tasks).then(() => {
      expect(tasks[0].calledBefore(tasks[1])).to.be.true;
      done();
    });
  });

  it('should resolve with last promise value', (done) => {
    const tasks = [sinon.stub().returns(1), sinon.stub().returns(2)];

    promiseWaterfall(tasks).then(value => {
      expect(value).to.equal(2);
      done();
    });
  });

});
