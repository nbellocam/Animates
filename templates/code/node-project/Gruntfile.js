/*global module:false */
/*jshint node:true */

module.exports = function (grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({

		//Read the package.json (optional)
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			output : 'build/output',
			src	: 'src/**/*.js',
			tests : 'test/**/*.js',
			gruntFile : 'Gruntfile.js',
		}
	});

	grunt.registerTask('doc', 
		function () {
			
			grunt.config.requires('meta.output');
			grunt.config.requires('meta.src');

			var output = grunt.config.get('meta.output'),
				src = grunt.config.get('meta.src'),
				jsdocConfig =	{
									src: [src], 
									dest: output + '/doc'
								};

			if(grunt.file.exists(output)) {
				grunt.file.delete(output);
			}
			grunt.file.mkdir(output);

			grunt.config.set('jsdoc.dist', jsdocConfig);

			grunt.loadNpmTasks('grunt-jsdoc');

			grunt.task.run('jsdoc');
		}
	);

	grunt.registerTask('lint', 
		function (target) {

			var src = grunt.config.get('meta.src'),
				tests = grunt.config.get('meta.tests'),
				gruntFile = grunt.config.get('meta.gruntFile'),
				jshintConfig = {
					all: [gruntFile, src, tests],
					code: [src],
					tests: [tests],
					options: {
						ignores: ['node_modules/**/*.js'],
						globals: {
							module: true
						}
					}
				};

			switch (target)
			{
				case 'code':
					grunt.config.requires('meta.src');
					break;
				case 'tests':
					grunt.config.requires('meta.tests');
					break;
				case 'all':
					grunt.config.requires('meta.src');
					grunt.config.requires('meta.tests');
					break;
				default:
					target = 'all';
			}

			grunt.config.set('jshint', jshintConfig);

			grunt.loadNpmTasks('grunt-contrib-jshint');

			grunt.task.run('jshint:' + target);
		}
	);

	grunt.registerTask('tests', 
		function (target) {

			var src = grunt.config.get('meta.src'),
				tests = grunt.config.get('meta.tests'),
				output = grunt.config.get('meta.output'),
				gruntFile = grunt.config.get('meta.gruntFile'),
				mochaConfig = {
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
						src: [tests]
					},
					coverage: {
						options: {
							reporter: 'html-cov',
							// use the quiet flag to suppress the mocha console output
							quiet: true,
							// specify a destination file to capture the mocha
							// output (the quiet option does not suppress this)
							captureFile: output + '/coverage.html'
						},
						src: [tests]
					},
					// The travis-cov reporter will fail the tests if the
					// coverage falls below the threshold configured in package.json
					'travis-cov': {
						options: {
							reporter: 'travis-cov'
						},
						src: [tests]
					}
				};

			if(grunt.file.exists(output)) {
				grunt.file.delete(output);
			}
			grunt.file.mkdir(output);

			grunt.loadNpmTasks('grunt-mocha-test');
			grunt.config.set('mochaTest', mochaConfig);

			grunt.task.run('mochaTest');
		}
	);

	grunt.registerTask('watch', 
		function (target) {

			var src = grunt.config.get('meta.src'),
				tests = grunt.config.get('meta.tests'),
				gruntFile = grunt.config.get('meta.gruntFile'),
				watchConfig = {
					code: {
						files: src,
						tasks: ['lint:code', 'tests']
					},
					test: {
						files: tests,
						tasks: ['lint:tests', 'tests']
					},
					all: {
						files: [src, tests],
						tasks: ['lint', 'tests']
					}
				};

			switch (target)
			{
				case 'code':
					grunt.config.requires('meta.src');
					break;
				case 'tests':
					grunt.config.requires('meta.tests');
					target = 'test';
					break;
				case 'all':
					grunt.config.requires('meta.src');
					grunt.config.requires('meta.tests');
					break;
				default:
					target = 'all';
			}

			grunt.config.set('watch', watchConfig);

			grunt.loadNpmTasks('grunt-contrib-watch');

			grunt.task.run('watch:' + target);
		}
	);

	grunt.registerTask('dev', ['lint:all', 'tests']);

	grunt.registerTask('default', ['lint:all', 'tests', 'doc']);
};