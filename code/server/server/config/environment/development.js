'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/animates-dev'
  },

  facebook: {
    clientID:     process.env.FACEBOOK_ID || '706836949406562',
    clientSecret: process.env.FACEBOOK_SECRET || '7ea17bdc211b7d48b77a28ec2600febe',
    callbackURL:  (process.env.DOMAIN || 'http://localhost:9000') + '/auth/facebook/callback'
  },

  twitter: {
    clientID:     process.env.TWITTER_ID || 'id',
    clientSecret: process.env.TWITTER_SECRET || 'secret',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/twitter/callback'
  },

  google: {
    clientID:     process.env.GOOGLE_ID || 'id',
    clientSecret: process.env.GOOGLE_SECRET || 'secret',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/google/callback'
  },

  seedDB: true
};
