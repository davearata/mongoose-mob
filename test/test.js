'use strict';

var mongoose = require('mongoose');
var mongooseMob = require('../');
var mongoUri = 'mongodb://localhost:27017/test';

describe('mongoose-mob node module', function () {
  it('should export schema', function () {
    var Schema = mongooseMob.Schema;
    should.exist(Schema);
  });

  it('should be able to call getmodel multiple times on same schema', function () {
    var Schema = mongooseMob.Schema;
    var UserSchema = new Schema();
    var User = mongooseMob.getModel(mongoose.connection, 'User', UserSchema);
    should.exist(User);
    (function() {
      mongooseMob.getModel(mongoose.connection, 'User', UserSchema);
    }).should.not.throw();
  });

  it('should be able to call getmodel multiple times on same schema same connections', function () {
    var Schema = mongooseMob.Schema;
    var UserSchema = new Schema();
    var connection = mongooseMob.getConnection(mongoUri);
    var User = mongooseMob.getModel(connection, 'User', UserSchema);
    should.exist(User);
    (function() {
      var connection2 = mongooseMob.getConnection(mongoUri);
      var User2 = mongooseMob.getModel(connection2, 'User', UserSchema);
      should.exist(User2);
      User2.should.equal(User);
    }).should.not.throw();
  });

  it('should return already existing connection', function () {
    var connection = mongooseMob.getConnection(mongoUri);
    var connection2 = mongooseMob.getConnection(mongoUri);
    connection.should.equal(connection2);
  });
});
