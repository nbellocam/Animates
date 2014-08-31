'use strict';

module.exports = {
  env: 'development',
  mongo: {
    uri: 'mongodb://animates-admin:Passw0rd@ds030817.mongolab.com:30817/animates-dev'
  },
  facebook: {
    clientID: "706836949406562",
    clientSecret: "7ea17bdc211b7d48b77a28ec2600febe",
    callbackURL: "http://localhost:9000/auth/facebook/callback"
  },
  twitter: {
    clientID: "CONSUMER_KEY",
    clientSecret: "CONSUMER_SECRET",
    callbackURL: "http://localhost:9000/auth/twitter/callback"
  },
  github: {
    clientID: "APP_ID",
    clientSecret: "APP_SECRET",
    callbackURL: "http://localhost:9000/auth/github/callback"
  },
  google: {
    clientID: "APP_ID",
    clientSecret: "APP_SECRET",
    callbackURL: "http://localhost:9000/auth/google/callback"
  },
  linkedin: {
    clientID: "API_KEY",
    clientSecret: "SECRET_KEY",
    callbackURL: "http://localhost:9000/auth/linkedin/callback"
  }
};
