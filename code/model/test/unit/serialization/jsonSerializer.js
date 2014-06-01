/*global describe, it */

'use strict';

var JsonSerializer = require('../../../src/serialization/jsonSerializer'),
	should = require("should");

describe('JsonSerializer', function() {
	describe('serializeArray should call toJSON of every object in the array', function() {
		var array = [
						{
							'toJSON' : function () { return 'prop1'; }
						},
						{
							'toJSON' : function () { return 'prop2'; }
						},
									{
							'toJSON' : function () { return 'prop3'; }
						}
					],
			json = null;

		json = JsonSerializer.serializeArray(array);

		json.should.have.lengthOf(3);
		json.should.containEql({'type' : 'Object', 'data' : 'prop1'});
		json.should.containEql({'type' : 'Object', 'data' : 'prop2'});
		json.should.containEql({'type' : 'Object', 'data' : 'prop3'});
	});

	describe('serializeDictionary should call toJSON of each key-value	', function() {
		var dic = {
						'key1' : 
							{
								'toJSON' : function () { return 'prop1'; }
							},
						'key2' : 
							{
								'toJSON' : function () { return 'prop2'; }
							},
					},
			json = null;

		json = JsonSerializer.serializeDictionary(dic);
		json.should.have.keys('key1', 'key2');
	});
});