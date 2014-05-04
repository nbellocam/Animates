'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
  root: rootPath,
  port: process.env.PORT || 9000,
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },
  
  // The secret should be set to a non-guessable string that
  // is used to compute a session hash
  sessionSecret: 'an!m4t3sS3cr3t!',
  // The name of the MongoDB collection to store sessions in
  sessionCollection: 'sessions'
};