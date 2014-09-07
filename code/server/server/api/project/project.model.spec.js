'use strict';

var should = require('should');
var app = require('../../app');
var Project = require('./project.model');
var User = require('../user/user.model');
var mongoose = require('mongoose');

var project = new Project({
  name: 'Fake Project'
});

describe('Project Model', function() {
  before(function(done) {
    // Clear projects before testing
    Project.remove().exec().then(function() {
      done();
    });

    // Clear users before testing
    User.remove().exec().then(function() {
      done();
    });

  });

  afterEach(function(done) {
    Project.remove().exec().then(function() {
      done();
    });

    // Clear users before testing
    User.remove().exec().then(function() {
      done();
    });

  });

  it('should begin with no projects', function(done) {
    Project.find({}, function(err, projects) {
      projects.should.have.length(0);
      done();
    });
  });

  it('should fail when saving a duplicate project', function(done) {
    project.save(function() {
      var projDup = new Project(project);
      projDup.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  it('should fail when saving without a name', function(done) {
    project.name = '';
    project.save(function(err) {
      should.exist(err);
      done();
    });
  });

  it('should update modified date on save and created should remain unchanged', function(done) {
    var proj = new Project({name : 'test'}),
        updated,
        created;

    proj.save(function(err) {
      should.not.exist(err);
      updated = proj.modified;
      created = proj.created;

      proj.save(function (err){
          should.not.exist(err);
          proj.created.should.eql(created);
          proj.modified.should.not.eql(updated);
          proj.modified.should.greaterThan(proj.created);
          done();
      });
    });
  });

  it('should create a default Animation', function(done) {
    var proj = new Project({name : 'test'});

    proj.save(function(err) {
      should.not.exist(err);
      var animation = proj.getAnimation();

      should.exists(animation.canvas);
      should.exists(animation.timeline);
      done();
    });
  });

  it('should retrieve project from on which the user is the author', function(done) {
    var userIdprimary = new mongoose.Types.ObjectId,
        userIdsecondary = new mongoose.Types.ObjectId;

    Project.create(
      {
        name : 'test',
        user :  userIdprimary
      },
      {
        name : 'test2',
        user :  userIdsecondary
      },
    function (err, proj) {
      Project.find({}, function(err, projects) {
        projects.should.have.length(2);

        Project.list(userIdprimary, function(err, projects) {
          projects.should.have.lengthOf(1);
          projects[0].name.should.eql('test');
          done();
        });
      });
    });
  });

  it('should retrieve project from on which the user is on its workgroup with view permissions', function(done) {
    var userIdprimary = new mongoose.Types.ObjectId,
        userIdsecondary = new mongoose.Types.ObjectId;

    Project.create(
      {
        name : 'test',
        user :  userIdprimary,
        workgroup : [
         {
           user : userIdsecondary,
           permission : 'play'
         }
        ]
      },
      {
        name : 'test2',
        user :  userIdsecondary
      },
      {
        name : 'test3',
        user :  userIdprimary
      },
    function (err, proj) {
      Project.find({}, function(err, projects) {
        projects.should.have.length(3);

        Project.list(userIdsecondary, function(err, projects) {
          projects.should.have.lengthOf(2);
          projects[0].name.should.not.eql('test3');
          projects[1].name.should.not.eql('test3');
          done();
        });
      });
    });
  });

  it('should add an inexistant collaborator', function(done) {
    User.create(
      {
        provider: 'local',
        name: 'Test User',
        email: 'test@test.com',
        password: 'test'
      },
      {
        provider: 'local',
        name: 'Test2 User',
        email: 'test2@test.com',
        password: 'test2'
      }, function (err, first, second) {
        Project.create(
          {
            name : 'test',
            user :  first._id
          },
        function (err, proj) {
          proj.addCollaborator( second._id, 'play', function (err, collaborator) {
            should.not.exists(err);
            should.exists(collaborator);
          	Project.findById(proj._id, function (err, found) {
                should.not.exists(err);
                should.exist(found);
                collaborator.user._id.should.eql(second._id);
                collaborator.permission.should.eql('play');
                found.workgroup[0].permission.should.eql('play');
                done();
            });
          });
        });
      });
  });

  it('should update the collaborator it is already added', function(done) {
    User.create(
      {
        provider: 'local',
        name: 'Test User',
        email: 'test@test.com',
        password: 'test'
      },
      {
        provider: 'local',
        name: 'Test2 User',
        email: 'test2@test.com',
        password: 'test2'
      }, function (err, first, second) {
        Project.create(
          {
            name : 'test',
            user :  first._id,
            workgroup : [
             {
               user : second._id,
               permission : 'edit'
             }
            ]
          },
        function (err, proj) {
          proj.addCollaborator( second._id, 'play', function (err, collaborator) {
            should.not.exists(err);
            should.exists(collaborator);
          	Project.findById(proj._id, function (err, found) {
                should.not.exists(err);
                should.exist(found);
                collaborator.permission.should.eql('play');
                collaborator.user._id.should.eql(second._id);
                found.workgroup[0].permission.should.eql('play');
                done();
            });
          });
        });
      });
  });

  it('should remove an existant collaborator', function(done) {
    var userIdprimary = new mongoose.Types.ObjectId,
        userIdsecondary = new mongoose.Types.ObjectId;

    Project.create(
      {
        name : 'test',
        user :  userIdprimary,
        workgroup : [
         {
           user : userIdsecondary,
           permission : 'edit'
         }
        ]
      },
    function (err, proj) {
      proj.removeCollaborator( userIdsecondary, function (err) {
        should.not.exists(err);

      	Project.findById(proj._id, function (err, found) {
            should.not.exists(err);
            should.exist(found);
            found.workgroup.should.have.lengthOf(0);
            done();
        });
      });
    });
  });

  it('should not fail when trying to remove a non existant collaborator', function(done) {
    var userIdprimary = new mongoose.Types.ObjectId,
        userIdsecondary = new mongoose.Types.ObjectId,
        userIdunknown = new mongoose.Types.ObjectId;

    Project.create(
      {
        name : 'test',
        user :  userIdprimary,
        workgroup : [
         {
           user : userIdsecondary,
           permission : 'edit'
         }
        ]
      },
    function (err, proj) {
      proj.removeCollaborator( userIdunknown, function (err) {
        should.not.exists(err);

      	Project.findById(proj._id, function (err, found) {
            should.not.exists(err);
            should.exist(found);
            found.workgroup.should.have.lengthOf(1);
            done();
        });
      });
    });
  });

  it('should make a project public', function(done) {
    var userIdprimary = new mongoose.Types.ObjectId;

    Project.create(
      {
        name : 'test',
        user :  userIdprimary
      },
    function (err, proj) {
      proj.makePublic(true, function (err) {
        should.not.exists(err);

      	Project.findById(proj._id, function (err, found) {
            should.not.exists(err);
            should.exist(found);
            found.public.should.be.ok;
            done();
        });
      });
    });
  });
});
