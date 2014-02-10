'use strict';

module.exports = {
    //db: "mongodb://localhost/mean",
    db: "mongodb://animates-admin:Passw0rd@ds030817.mongolab.com:30817/animates-dev",
    app: {
        name: "MEAN - A Modern Stack - Production"
    },
    facebook: {
        clientID: "APP_ID",
        clientSecret: "APP_SECRET",
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    twitter: {
        clientID: "CONSUMER_KEY",
        clientSecret: "CONSUMER_SECRET",
        callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    github: {
        clientID: "APP_ID",
        clientSecret: "APP_SECRET",
        callbackURL: "http://localhost:3000/auth/github/callback"
    },
    google: {
        clientID: "APP_ID",
        clientSecret: "APP_SECRET",
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
    linkedin: {
        clientID: "API_KEY",
        clientSecret: "SECRET_KEY",
        callbackURL: "http://localhost:3000/auth/linkedin/callback"
    }
}