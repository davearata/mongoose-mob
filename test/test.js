'use strict';

describe('mongoose-mob node module', function() {
  it('should export schema', function() {
    var Schema = require('../').Schema;
    should.exist(Schema);
  });
});
