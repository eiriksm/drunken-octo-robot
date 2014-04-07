var should = require('should');

describe('Module export', function() {
  it('Should expose functions as expected', function() {
    require('../lib/beeroclock').should.be.instanceOf(Function);
  });
});
