'use strict';

var mongoose = require('mongoose');
var _ = require('lodash');

var connections = {};

var connect = function connect(uri, opts) {
  //console.log('creating mongoose connection to: ' + uri);
  var connection = mongoose.createConnection(uri, opts);


  connection.on('connected', function () {
    //console.log('Mongoose connection open to  ' + uri);
  });

  // When the connection is disconnected
  connection.on('disconnected', function () {
    //console.log('Mongoose ' + uri + ' connection disconnected');
  });

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', function () {
    connection.close(function () {
      //console.log(uri + ' connection disconnected through app termination');
      process.exit(0);
    });
  });

  connections[uri] = connection;

  return connection;
};

module.exports = {
  Schema: mongoose.Schema,

  getConnection: function getConnection(uri, opts) {
    if (_.isObject(connections[uri])) {
      return connections[uri];
    }

    return connect(uri, opts);
  },

  getModel: function getModel(connection, name, schema) {
    var modelNames = connection.modelNames();
    if (_.includes(modelNames, name)) {
      return connection.model(name);
    } else {
      return connection.model(name, schema);
    }
  }
};
