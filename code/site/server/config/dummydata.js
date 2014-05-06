'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Project = mongoose.model('Project');

/**
 * Populate database with sample application data
 */

//Clear old things, then add things in
//Thing.find({}).remove(function() {
//  Thing.create({
//    name : 'HTML5 Boilerplate',
//    info : 'HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.',
//     awesomeness: 8
//   }, {
//     name : 'AngularJS',
//     info : 'AngularJS is a toolset for building the framework most suited to your application development.',
//     awesomeness: 10
//   }, {
//     name : 'Express',
//     info : 'Flexible and minimalist web application framework for node.js.',
//     awesomeness: 10
//   },  {
//     name : 'Grunt.js',
//     info : 'Build the project',
//     awesomeness: 9
//   }, {
//     name : 'MongoDB + Mongoose',
//     info : 'An excellent document database. Combined with Mongoose to simplify adding validation and business logic.',
//     awesomeness: 7
//   }, function() {
//       console.log('finished populating things');
//     }
//   );
// });

// Clear old users, then add a default user
User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    username: 'TestUser',
    roles: ['authenticated'],
    email: 'test@test.com',
    password: 'test'
  }, function(err, newUser) {
      if (err){ 
        console.log('An error occurs while creating the users');
        return;
      }

      console.log('finished populating users');

      //Clear old projects, then add projects in
      Project.find({}).remove(function() {
        Project.create({
          title: 'Animation test',
          description: 'This is an incredible animation test.',
          user: newUser._id
        }, {
          title: 'Animation: The movie',
          description: 'You should see the second part, it is incredible.',
          user: newUser._id
        }, function() {
             console.log('finished populating projects');
          }
        );
      });
    }
  );
});
