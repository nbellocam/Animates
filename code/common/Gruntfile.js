/*global module:false */
/*jshint node:true */

module.exports = function (grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({

		//Read the package.json (optional)
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
			code: ['src/**/*.js'],
			tests: ['test/**/*.js'],
			options: {
				ignores: ['node_modules/**/*.js'],
				globals: {
					module: true
				}
			}
		},
		watch: {
			code: {
				files: '<%= jshint.code %>',
				tasks: ['jshint:code', 'mochaTest']
			},
			test: {
				files: '<%= jshint.tests %>',
				tasks: ['jshint:tests', 'mochaTest']
			},
			all: {
				files: '<%= jshint.all %>',
				tasks: ['jshint:all', 'mochaTest']
			}
		},
		// Configure a mochaTest task
		mochaTest: {
			test: {
				options: {
					reporter: 'spec',
					// Require blanket wrapper here to instrument other required
					// files on the fly. 
					//
					// NB. We cannot require blanket directly as it
					// detects that we are not running mocha cli and loads differently.
					//
					// NNB. As mocha is 'clever' enough to only run the tests once for
					// each file the following coverage task does not actually run any
					// tests which is why the coverage instrumentation has to be done here
					require: 'build/config/blanket'
				},
				src: ['test/**/*.js']
			},
			coverage: {
				options: {
					reporter: 'html-cov',
					// use the quiet flag to suppress the mocha console output
					quiet: true,
					// specify a destination file to capture the mocha
					// output (the quiet option does not suppress this)
					captureFile: 'build/output/coverage.html'
				},
				src: ['test/**/*.js']
			},
			// The travis-cov reporter will fail the tests if the
			// coverage falls below the threshold configured in package.json
			'travis-cov': {
				options: {
					reporter: 'travis-cov'
				},
				src: ['test/**/*.js']
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Add the grunt-mocha-test tasks.
	grunt.loadNpmTasks('grunt-mocha-test');

	if(grunt.file.exists('build/output'))
	{
		grunt.file.delete('build/output');	
	}
	
	grunt.file.mkdir('build/output');

	grunt.registerTask('test', ['jshint:all','mochaTest']);

	// Default task
	grunt.registerTask('default', ['jshint:all','mochaTest']);
};