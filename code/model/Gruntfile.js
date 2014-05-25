/*global module:false */
/*jshint node:true */

var path = require('path');

module.exports = function (grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({

		//Read the package.json (optional)
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			output : 'build/output',
			packageEntryName : 'model',
			packageOutputFileName : 'model.js',
			packageEntryPoint : 'src/model.js',
			srcDir: 'src',
			nodeModulesDir: 'node_modules',
			modelNpmDir: 'modelNpm',
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
									dest: path.join(output, 'doc')
								};

			grunt.config.set('jsdoc.dist', jsdocConfig);

			grunt.loadNpmTasks('grunt-jsdoc');

			grunt.task.run('jsdoc');
		}
	);

	grunt.registerTask('lint', 
		function (target) {
			var src = grunt.config.get('meta.src'),
				output = grunt.config.get('meta.output'),
				tests = grunt.config.get('meta.tests'),
				gruntFile = grunt.config.get('meta.gruntFile'),
				jshintConfig = {
					all: [gruntFile, src, tests],
					code: [src],
					tests: [tests],
					options: {
						expr:true,
						node:true,
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
				case 'build':
					grunt.config.requires('meta.src');
					grunt.config.requires('meta.tests');
					grunt.config.requires('meta.output');
					jshintConfig.options.reporter = 'jslint';
					jshintConfig.options.reporterOutput = path.join(output, 'jshint-result.xml');
					jshintConfig.options.force = true;
					target = 'all';
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
							captureFile: path.join(output, 'coverage.html')
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

			if (target === 'build'){
				mochaConfig.test.options.reporter = 'xunit';
				mochaConfig.test.options.quiet = true;
				mochaConfig.test.options.captureFile = path.join(output, 'test-results.xml');
			}

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

	grunt.registerTask('package-model', 
		function () {
			grunt.config.requires('meta.output');
			grunt.config.requires('meta.packageEntryName');
			grunt.config.requires('meta.packageOutputFileName');
			grunt.config.requires('meta.packageEntryPoint');

			var output = grunt.config.get('meta.output'),
				packageEntryName = grunt.config.get('meta.packageEntryName'),
				packageOutputFileName = grunt.config.get('meta.packageOutputFileName'),
				packageEntryPoint = grunt.config.get('meta.packageEntryPoint'),
				browserifyConfig =	{
									src: [packageEntryPoint], 
									dest: path.join(output, packageOutputFileName),
									options: {
										standalone: packageEntryName
									}
								};

			grunt.config.set('browserify.dist', browserifyConfig);

			grunt.loadNpmTasks('grunt-browserify');

			grunt.task.run('browserify');
		}
	);

	grunt.registerTask('resetOutput', 
		function () {
			grunt.config.requires('meta.output');

			var output = grunt.config.get('meta.output');

			if(grunt.file.exists(output)) {
				grunt.file.delete(output);
			}

			grunt.file.mkdir(output);
		}
	);

	grunt.registerTask('package-npm-module', 
		function () {
			grunt.config.requires('meta.output');
			grunt.config.requires('meta.srcDir');
			grunt.config.requires('meta.nodeModulesDir');
			grunt.config.requires('meta.modelNpmDir');
			grunt.config.requires('pkg');

			var output = grunt.config.get('meta.output');
			var srcDir = grunt.config.get('meta.srcDir');
			var nodeModulesDir = grunt.config.get('meta.nodeModulesDir');
			var modelNpmDir = grunt.config.get('meta.modelNpmDir');
			var pkg = grunt.config.get('pkg');
			
			var modelNpmPath = path.join(output, modelNpmDir);
			grunt.file.mkdir(modelNpmPath);


			var dependenciesPaths = [];
			var dependencies = pkg.dependencies;

			for (var prop in dependencies) {
				if(dependencies.hasOwnProperty(prop)){
					dependenciesPaths.push(prop + '/**/*');
				}
			}

			var copyConfig = {
				dependencies : {
					expand: true,
					dot: true,
					cwd: nodeModulesDir,
					dest: path.join(modelNpmPath, nodeModulesDir),
					src: dependenciesPaths
				},
				src: {
					expand: true,
					dot: true,
					cwd: srcDir,
					dest: path.join(modelNpmPath, srcDir),
					src: ['**/*']
				},
				packageJson: {
					expand: true,
					dot: true,
					dest: modelNpmPath,
					src: ['package.json']
				}
			};

			grunt.config.set('copy', copyConfig);

			grunt.loadNpmTasks('grunt-contrib-copy');

			grunt.task.run(['copy:dependencies', 'copy:src', 'copy:packageJson']);
		}
	);

	grunt.registerTask('dev', ['lint:all', 'resetOutput', 'tests']);

	grunt.registerTask('package', ['resetOutput', 'package-model']);

	grunt.registerTask('ci-build', ['resetOutput', 'lint:build', 'tests:build', 'doc', 'package-model', 'package-npm-module']);

	grunt.registerTask('default', ['resetOutput', 'lint:all', 'tests', 'package-model']);
};