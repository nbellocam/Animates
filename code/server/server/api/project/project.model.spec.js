'use strict';

var should = require('should');
var app = require('../../app');
var Project = require('./project.model');

var project = new Project({
  name: 'Fake Project'
});

describe('Project Model', function() {
  before(function(done) {
    // Clear projects before testing
    Project.remove().exec().then(function() {
      done();
    });
  });

  afterEach(function(done) {
    Project.remove().exec().then(function() {
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
    project.save(function() {
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
  });

  it('should create a default Animation', function(done) {
    project.save(function() {
      var proj = new Project({name : 'test'});

      proj.save(function(err) {
        should.not.exist(err);
        var animation = proj.getAnimation();

        should.exists(animation.canvas);
        should.exists(animation.timeline);
        done();
      });
    });
  });
});
