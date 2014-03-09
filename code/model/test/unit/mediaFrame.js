/*global describe, it */

'use strict';

var MediaFrame = require('../../src/mediaFrame'),
	should = require("should");

describe('MediaFrame', function() {

	function MediaObjectMock () {
		this.getProperties = function properties () {
			return {
				h : 100,
				w : 200,
				l : 10
			};
		};
	}

	describe('constructor', function(){
		it('Should fail without mediaObject option.', function(){
			should(function () { new MediaFrame(); }).throw();
		});	

		it('Should use constructor properties', function(){
			var mediaObject = new MediaObjectMock(),
				mediaFrame = new MediaFrame({ mediaObject :  mediaObject}),
				currentProperties = mediaFrame.properties();

			currentProperties.h.should.be.exactly(100);
			currentProperties.w.should.be.exactly(200);
			currentProperties.l.should.be.exactly(10);
		});	
	});

	describe('properties()', function(){
		it('Should override passed properties leaving the missing ones untouched.', function(){
			var mediaObject = new MediaObjectMock(),
				mediaFrame = new MediaFrame({ mediaObject :  mediaObject}),
				currentProperties = mediaFrame.properties();

			currentProperties.h.should.be.exactly(100);
			currentProperties.w.should.be.exactly(200);
			currentProperties.l.should.be.exactly(10);

			mediaFrame.properties({ h : 255 });
			currentProperties = mediaFrame.properties();

			currentProperties.h.should.be.exactly(255);
			currentProperties.w.should.be.exactly(200);
			currentProperties.l.should.be.exactly(10);
		});	
	});

	describe('getProperty()', function(){
		it('Should return undefined if property does not exits.', function(){
			var instance = new MediaFrame({
					mediaObject : {
						getProperties : function getProperties() {
							return {};
						}
					}
				}),
				propertyValue = instance.getProperty('invalidProperty');

			should.equal(propertyValue, undefined);
		});

		it('Should return undefined if property is empty.', function(){
			var instance = new MediaFrame({
					mediaObject : {
						getProperties : function getProperties() {
							return {};
						}
					}
				}),
				propertyValue = instance.getProperty('');

			should.equal(propertyValue, undefined);
		});

		it('Should return undefined if parent property is empty.', function(){
			var instance = new MediaFrame({
					mediaObject : {
						getProperties : function getProperties() {
							return {};
						}
					}
				}),
				propertyValue = instance.getProperty('parentPropertyName.innerPropertyName');

			should.equal(propertyValue, undefined);
		});

		it('Should return undefined if inner property is empty.', function(){
			var instance = new MediaFrame({
					mediaObject : {
						getProperties : function getProperties() {
							return { parentPropertyName: {} };
						}
					}
				}),
				propertyValue = instance.getProperty('parentPropertyName.innerPropertyName');

			should.equal(propertyValue, undefined);
		});

		it('Should return undefined if property is not passed by argument.', function(){
			var instance = new MediaFrame({
					mediaObject : {
						getProperties : function getProperties() {
							return {};
						}
					}
				}),
				propertyValue = instance.getProperty();

			should.equal(propertyValue, undefined);
		});

		it('Should return the property if it exits.', function(){
			var specifiedPropertyValue = 'value1',
				instance = new MediaFrame({
					mediaObject : {
						getProperties : function getProperties() {
							return { propertyName: specifiedPropertyValue };
						}
					}
				}),
				propertyValue = instance.getProperty('propertyName');

			propertyValue.should.eql(specifiedPropertyValue);
		});

		it('Should return the inner property if it exits.', function(){
			var specifiedPropertyValue = 'value',
				instance = new MediaFrame({
					mediaObject : {
						getProperties : function getProperties() {
							return { 
								parentPropertyName: {
									innerPropertyName : specifiedPropertyValue
								} 
							};
						}
					}
				}),
				propertyValue = instance.getProperty('parentPropertyName.innerPropertyName');

			propertyValue.should.eql(specifiedPropertyValue);
		});
	});
});
