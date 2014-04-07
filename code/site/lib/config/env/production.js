'use strict';

module.exports = {
  env: 'production',
  mongo: {
    uri: process.env.MONGOLAB_URI ||
         process.env.MONGOHQ_URL ||
         'mongodb://AnimatesMongoDB:Tj2h2YKxcrYT3LbrIQJbj4UftCrCwPWqsn4USqdVJ6M-@ds031088.mongolab.com:31088/AnimatesMongoDB'
  }
};