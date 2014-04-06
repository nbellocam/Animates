'use strict';

module.exports = {
    //db: "mongodb://localhost/mean",
    db: "mongodb://AnimatesMongoDB:Tj2h2YKxcrYT3LbrIQJbj4UftCrCwPWqsn4USqdVJ6M-@ds031088.mongolab.com:31088/AnimatesMongoDB",
    app: {
        name: "Animates"
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