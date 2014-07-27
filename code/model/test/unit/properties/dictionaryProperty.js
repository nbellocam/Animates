/*global describe, it */

'use strict';

var Common = require('animates-common'),
	Property = require('../../../src/properties/property'),
	PropertyBuilder = require('../../../src/properties/propertyBuilder'),
	CompositeProperty = require('../../../src/properties/compositeProperty'),
	CompositePropertyBuilder = require('../../../src/properties/compositePropertyBuilder'),
	DictionaryProperty = require('../../../src/properties/dictionaryProperty'),
	TypesManager = require('../../../src/properties/typesManager'),
	should = require("should");

describe('DictionaryProperty', function() {
	function propertyOptions () {
		return {
			'type' : 'custom',
			'value' : 'val',
			'constraints' : []
		};
	}

	function subPropertyOptions () {
		return {
			'type' : 'custom',
			'value' : 'val2',
			'constraints' : []
		};
	}

	TypesManager.registerType('custom', []);


	it('Should fail when call add method from outside a builder', function () {
		var properties = new DictionaryProperty(),
			compositeProperty = new CompositeProperty(),
			spOp = subPropertyOptions(),
			pOp = propertyOptions();

		(function(){
			properties.add('property1', compositeProperty);			
		}).should.throw('Method add cannot be called from outside a builder');
	});

	it('Should fail when setValue is called with no schema set', function () {
		var properties = new DictionaryProperty(),
			compositeProperty = new CompositeProperty(),
			spOp = subPropertyOptions(),
			pOp = propertyOptions();

		(function(){
			properties.setValue('property1', {});			
		}).should.throw("Set an schema before trying to set a value for the property 'property1'");
	});

	it('Should should add a new guid if not exists', function () {
		var properties = new DictionaryProperty(),
			schema = new CompositePropertyBuilder(),
			spOp = subPropertyOptions(),
			pOp = propertyOptions();

		// Define the schema
		schema
			.property('prop', PropertyBuilder)
				.value('default')
				.type('custom')
			.add();
		properties.schema(schema);

		// Try to add the value
		properties.setValue('id1', { 'prop' : 'newValue' });
		properties.getValue('id1.prop').should.equal('newValue');
	});

	it('Should update an inner property', function () {
		var properties = new DictionaryProperty(),
			schema = new CompositePropertyBuilder();

		// Define the schema
		schema
			.property('prop', PropertyBuilder)
				.value('default')
				.type('custom')
			.add();
		properties.schema(schema);

		// Try to add the value
		properties.setValue('id1', { 'prop' : 'newValue' });
		properties.setValue('id1.prop', 'anotherNewValue');

		properties.getValue('id1.prop').should.equal('anotherNewValue');
	});
});