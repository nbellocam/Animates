/*global module:false */
/*jshint node:true */

module.exports = function (grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({

		//Read the package.json (optional)
		pkg: grunt.file.readJSON('package.json'),
		
		meta : {
			paths : {
				all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
				code: ['src/**/*.js'],
				tests: ['test/**/*.js']
			}
		},

		jsdoc : {
			dist : {
				src: '<%= meta.paths.code %>', 
				dest: 'build/output/doc'
			}
		},
		jshint: {
			all: '<%= meta.paths.all %>',
			code: '<%= meta.paths.code %>',
			tests: '<%= meta.paths.tests %>',
			options: {
				ignores: ['node_modules/**/*.js'],
				globals: {
					module: true
				}
			}
		},
		watch: {
			all: {
				files: '<%= meta.paths.all %>',
				tasks: ['jshint:all', 'mochaTest']
			},
			code: {
				files: '<%= meta.paths.code %>',
				tasks: ['jshint:code', 'mochaTest']
			},
			test: {
				files: '<%= meta.paths.tests %>',
				tasks: ['jshint:tests', 'mochaTest']
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
				src: '<%= meta.paths.tests %>'
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
				src: '<%= meta.paths.tests %>'
			},
			// The travis-cov reporter will fail the tests if the
			// coverage falls below the threshold configured in package.json
			'travis-cov': {
				options: {
					reporter: 'travis-cov'
				},
				src: '<%= meta.paths.tests %>'
			}
		}
	});


	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jsdoc');
	// Add the grunt-mocha-test tasks.
	grunt.loadNpmTasks('grunt-mocha-test');

	// Create the output folder
	if(grunt.file.exists('build/output')) {
		grunt.file.delete('build/output');
	}
	grunt.file.mkdir('build/output');

	grunt.registerTask('test', ['mochaTest']);

	grunt.registerTask('doc', ['jsdoc']);

	grunt.registerTask('build', ['jshint:all','mochaTest','jsdoc']);

	// Default task
	grunt.registerTask('default', ['jshint:all','mochaTest']);
};
