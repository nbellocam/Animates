/*global require, describe, it */
var TemplateClass = require('../src/class'),
	assert = require("assert");

describe('ClassTemplate', function(){
	describe('#constructor()', function(){
		it('publicMethodPrint should be present in the templateClass instance', function(){
			var instance = new TemplateClass();
			assert.equal('function', typeof instance.publicMethodPrint);
		});
	});
});
