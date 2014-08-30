'use strict';

module.exports = {
  env: 'production',
  mongo: {
    uri: process.env.MONGOLAB_URI ||
         process.env.MONGOHQ_URL ||
         'mongodb://AnimatesMongoDB:Tj2h2YKxcrYT3LbrIQJbj4UftCrCwPWqsn4USqdVJ6M-@ds031088.mongolab.com:31088/AnimatesMongoDB'
  },
  facebook: {
    clientID: "706834929406764",
    clientSecret: "55a89af5cfa7827fcf9d7b860700f70e",
    callbackURL: "http://animates.azurewebsites.net/auth/facebook/callback"
  },
  twitter: {
    clientID: "T2tk3otVJwstqXL8kd1BBAHuR",
    clientSecret: "uHmoNRQ7dpvjBaTorNQGPzVKZCKqH28IqcBi1eBb9YatQE4B7V",
    callbackURL: "http://animates.azurewebsites.net/auth/twitter/callback"
  },
  github: {
    clientID: "APP_ID",
    clientSecret: "APP_SECRET",
    callbackURL: "http://animates.azurewebsites.net/auth/github/callback"
  },
  google: {
    clientID: "APP_ID",
    clientSecret: "APP_SECRET",
    callbackURL: "http://animates.azurewebsites.net/auth/google/callback"
  },
  linkedin: {
    clientID: "API_KEY",
    clientSecret: "SECRET_KEY",
    callbackURL: "http://animates.azurewebsites.net/auth/linkedin/callback"
  }
};
