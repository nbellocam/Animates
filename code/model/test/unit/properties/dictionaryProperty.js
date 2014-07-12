/*global describe, it */

'use strict';

var Common = require('animates-common'),
	Property = require('../../../src/properties/property'),
	CompositeProperty = require('../../../src/properties/compositeProperty'),
	DictionaryProperty = require('../../../src/properties/dictionaryProperty'),
	DictionaryPropertyBuilder = require('../../../src/properties/compositePropertyBuilder'),
	TypesManager = require('../../../src/properties/typesManager'),
	should = require("should");

describe('DictionaryPropertyBuilder', function() {
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


	it('Should get properties and sub-properties values', function () {
		var properties = new DictionaryProperty(),
			compositeProperty = new CompositeProperty(),
			spOp = subPropertyOptions(),
			pOp = propertyOptions();


		compositeProperty.add('sub-prop1', new Property(spOp));
		properties.add('property1', new Property(pOp));
		properties.add('property2', compositeProperty);

		properties.getValue('property1').should.equal('val');
		properties.getValue('property2.sub-prop1').should.equal('val2');
	});

	it('Should set properties and sub-properties values', function () {
		var properties = new DictionaryProperty(),
			compositeProperty = new CompositeProperty(),
			spOp = subPropertyOptions(),
			pOp = propertyOptions();


		compositeProperty.add('sub-prop1', new Property(spOp));
		properties.add('property1', new Property(pOp));
		properties.add('property2', compositeProperty);

		properties.getValue('property1').should.equal('val');
		properties.getValue('property2.sub-prop1').should.equal('val2');

		properties.setValue('property1', 'newVal');
		properties.setValue('property2.sub-prop1','newVal2');

		properties.getValue('property1').should.equal('newVal');
		properties.getValue('property2.sub-prop1').should.equal('newVal2');
	});

	it('Should create a clone', function () {
		var properties = new DictionaryProperty(),
			compositeProperty = new CompositeProperty(),
			compositePropertyClone,
			spOp = subPropertyOptions(),
			pOp = propertyOptions();


		compositeProperty.add('sub-prop1', new Property(spOp));
		properties.add('property1', new Property(pOp));
		properties.add('property2', compositeProperty);

		properties.getValue('property1').should.equal('val');
		properties.getValue('property2.sub-prop1').should.equal('val2');
		
		compositePropertyClone = properties.clone();

		compositePropertyClone.getValue('property1').should.equal('val');
		compositePropertyClone.getValue('property2.sub-prop1').should.equal('val2');

		properties.setValue('property1', 'newVal');
		properties.setValue('property2.sub-prop1','newVal2');

		properties.getValue('property1').should.equal('newVal');
		properties.getValue('property2.sub-prop1').should.equal('newVal2');

		compositePropertyClone.getValue('property1').should.equal('val');
		compositePropertyClone.getValue('property2.sub-prop1').should.equal('val2');

		compositePropertyClone.setValue('property1', 'newValCloned');
		compositePropertyClone.setValue('property2.sub-prop1','newVal2Cloned');

		compositePropertyClone.getValue('property1').should.equal('newValCloned');
		compositePropertyClone.getValue('property2.sub-prop1').should.equal('newVal2Cloned');

		properties.getValue('property1').should.equal('newVal');
		properties.getValue('property2.sub-prop1').should.equal('newVal2');
	});

	it('Should build json object from values', function () {
		var properties = new DictionaryProperty(),
			compositeProperty = new CompositeProperty(),
			spOp = subPropertyOptions(),
			pOp = propertyOptions(),
			json;


		compositeProperty.add('sub-prop1', new Property(spOp));
		properties.add('property1', new Property(pOp));
		properties.add('property2', compositeProperty);

		json = properties.valuesToJSON();

		json.should.have.keys('property1', 'property2');
		json.property2.should.have.property('sub-prop1');
	});

	it('Should build values from json object', function () {
		var properties = new DictionaryProperty(),
			compositeProperty = new CompositeProperty(),
			spOp = subPropertyOptions(),
			pOp = propertyOptions(),
			json = { property1: 'jsonVal', property2: { 'sub-prop1': 'jsonSubVal' } };


		compositeProperty.add('sub-prop1', new Property(spOp));
		properties.add('property1', new Property(pOp));
		properties.add('property2', compositeProperty);

		properties.valuesFromJSON(json);

		properties.getValue('property1').should.equal('jsonVal');
		properties.getValue('property2.sub-prop1').should.equal('jsonSubVal');
	});
});