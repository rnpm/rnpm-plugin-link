const chai = require('chai');
const expect = chai.expect;
const applyParams = require('../../../src/android/patches/applyParams');

describe('applyParams', () => {
  it('apply params to the string', () => {
    expect(
      applyParams('${foo}', {foo: 'foo'})
    ).to.be.equal('this.getResources().getString(R.strings.foo)');
  });
});
