/*global describe, it */

'use strict';

var Property = require('../../../src/properties/property'),
	CompositeProperty = require('../../../src/properties/compositeProperty'),
	CompositePropertyBuilder = require('../../../src/properties/compositePropertyBuilder'),
	TypesManager = require('../../../src/properties/typesManager'),
	should = require("should");

describe('CompositePropertyBuilder', function() {
	var propertyOptions = 
				{
					'type' : 'custom',
					'value' : 'val',
					'constraints' : []
				},
		subPropertyOptions = 
				{
					'type' : 'custom',
					'value' : 'val2',
					'constraints' : []
				};

	TypesManager.registerType('custom', []);


	it('Should get properties and sub-properties values', function () {
		var properties = new CompositeProperty(),
			compositeProperty = new CompositeProperty();


		compositeProperty.add('sub-prop1', new Property(subPropertyOptions));
		properties.add('property1', new Property(propertyOptions));
		properties.add('property2', compositeProperty);

		properties.getValue('property1').should.equal('val');
		properties.getValue('property2.sub-prop1').should.equal('val2');
	});

	it('Should set properties and sub-properties values', function () {
		var properties = new CompositeProperty(),
			compositeProperty = new CompositeProperty();


		compositeProperty.add('sub-prop1', new Property(subPropertyOptions));
		properties.add('property1', new Property(propertyOptions));
		properties.add('property2', compositeProperty);

		properties.getValue('property1').should.equal('val');
		properties.getValue('property2.sub-prop1').should.equal('val2');

		properties.setValue('property1', 'newVal');
		properties.setValue('property2.sub-prop1','newVal2');

		properties.getValue('property1').should.equal('newVal');
		properties.getValue('property2.sub-prop1').should.equal('newVal2');
	});

	it('Should build json object from values', function () {
		var properties = new CompositeProperty(),
			compositeProperty = new CompositeProperty(),
			json;


		compositeProperty.add('sub-prop1', new Property(subPropertyOptions));
		properties.add('property1', new Property(propertyOptions));
		properties.add('property2', compositeProperty);

		json = properties.valuesToJSON();

		json.should.have.keys('property1', 'property2');
		json.property2.should.have.property('sub-prop1');
	});

	it('Should build values from json object', function () {
		var properties = new CompositeProperty(),
			compositeProperty = new CompositeProperty(),
			json = { property1: 'jsonVal', property2: { 'sub-prop1': 'jsonSubVal' } };


		compositeProperty.add('sub-prop1', new Property(subPropertyOptions));
		properties.add('property1', new Property(propertyOptions));
		properties.add('property2', compositeProperty);

		properties.valuesFromJSON(json);

		properties.getValue('property1').should.equal('jsonVal');
		properties.getValue('property2.sub-prop1').should.equal('jsonSubVal');
	});
});