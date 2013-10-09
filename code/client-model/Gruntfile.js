/*global module:false */
/*jshint node:true */

module.exports = function (grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({

		//Read the package.json (optional)
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			files: ['**/*.js'],
			options: {
				ignores: ['node_modules/**/*.js'],
				globals: {
					module: true
				}
			}
		},
		watch: {
			jshint: {
				files: jshint.files,
				tasks: ['jshint']
			},
			//test: {
			//	files: '<%= jshint.test.src %>',
			//	tasks: ['jshint:test', 'qunit']
			//},
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('test', ['jshint']);
	// Default task
	grunt.registerTask('default', ['jshint']);
};
