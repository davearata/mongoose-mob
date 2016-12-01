import mongoose from 'mongoose'
import mongooseMob from '../../index'
const Schema = mongooseMob.Schema
const mongoUri = 'mongodb://localhost:27017/test'

describe('mongoose-mob node module', function () {
  beforeEach(function (done) {
    mongooseMob.closeAllConnections(done)
  })

  it('should export schema', function () {
    should.exist(Schema)
    should.exist(Schema.Types)
  })

  it('should be able to call getmodel multiple times on same schema', function () {
    const UserSchema = new Schema()
    const User = mongooseMob.getModel(mongoose.connection, 'User', UserSchema)
    expect(User).to.exist
    expect(() => {
      mongooseMob.getModel(mongoose.connection, 'User', UserSchema)
    }).to.not.throw()
  })

  it('should be able to call getmodel multiple times on same schema same connections', function () {
    const UserSchema = new Schema()
    const connection = mongooseMob.getConnection(mongoUri)
    const User = mongooseMob.getModel(connection, 'User', UserSchema)
    should.exist(User)
    expect(() => {
      const connection2 = mongooseMob.getConnection(mongoUri)
      const User2 = mongooseMob.getModel(connection2, 'User', UserSchema)
      should.exist(User2)
      User2.should.equal(User)
    }).to.not.throw()
  })

  it('should return already existing connection', function () {
    const connection = mongooseMob.getConnection(mongoUri)
    const connection2 = mongooseMob.getConnection(mongoUri)
    connection.should.equal(connection2)
  })

  it('should close all connections', function (done) {
    const connection = mongooseMob.getConnection(mongoUri)
    const mongoUri2 = 'mongodb://127.0.0.1:27017/test'
    const connection2 = mongooseMob.getConnection(mongoUri2)
    let disconnects = 0
    connection.on('disconnected', () => {
      disconnects++
    })
    connection2.on('disconnected', () => {
      disconnects++
    })
    mongooseMob.closeAllConnections(() => {
      expect(disconnects).to.equal(2)
      done()
    })
  })
})
