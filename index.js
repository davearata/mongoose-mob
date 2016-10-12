import _ from 'lodash'
import co from 'co'
import debug from 'debug'
import exitHook from 'async-exit-hook'
import mongoose from 'mongoose'
mongoose.Promise = global.Promise

const log = debug('mongoose-mob')

const connections = {}

const connect = (uri, opts) => {
  log('creating mongoose connection to: ' + uri)
  const connection = mongoose.createConnection(uri, opts)

  connection.on('connected', () => log('Mongoose connection open to ' + uri))

  // When the connection is disconnected
  connection.on('disconnected', () => log('Mongoose ' + uri + ' connection disconnected'))

  connections[uri] = connection

  return connection
}

const connectionOpened = connection => {
  return new Promise((resolve, reject) => {
    try {
      connection.on('connected', () => resolve())
    } catch (err) {
      reject(err)
    }
  })
}

const closeConnection = (connection, uri) => {
  return new Promise((resolve, reject) => {
    try {
      connection.close(() => {
        log(uri + ' connection disconnected')
        _.unset(connections, uri)
        resolve()
      })
    } catch (err) {
      reject(err)
    }
  })
}

const closeAllConnections = callback => {
  log('closing all connections')
  co(function * () {
    for (const uri in connections) {
      const connection = connections[uri]
      if (!connection._hasOpened) {
        yield connectionOpened(connection)
      }
      yield closeConnection(connection, uri)
    }
    callback()
  })
}

exitHook(callback => closeAllConnections(callback))

export const mongooseMob = {
  Schema: mongoose.Schema,

  closeAllConnections,

  getConnection: function getConnection (uri, opts) {
    if (_.isObject(connections[uri])) {
      return connections[uri]
    }

    return connect(uri, opts)
  },

  getModel: function getModel (connection, name, schema) {
    const modelNames = connection.modelNames()
    if (_.includes(modelNames, name)) {
      return connection.model(name)
    } else {
      return connection.model(name, schema)
    }
  }
}

export default mongooseMob
