/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Project = require('../api/project/project.model');

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
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
