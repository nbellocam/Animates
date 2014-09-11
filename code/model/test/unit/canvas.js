/*global describe, it */

'use strict';


var Canvas = require('../../src/canvas'),
	should = require("should");

describe('Canvas', function () {
	describe('Serialization', function() {
		it('toJSON should return json', function() {
			var canvas = new Canvas(),
				json = canvas.toJSON();

			json.should.have.property('height', 400);
			json.should.have.property('width', 600);
			json.should.have.property('backgroundColor', '#FFFFFF');
			json.should.have.property('backgroundImage', '');
		});

		it('fromJSON should load the object', function() {
			var canvas = new Canvas( {'height':500, 'width': 500, 'backgroundColor':'red'}),
				json = canvas.toJSON(),
				canvas2 = new Canvas();

			canvas2.fromJSON(json);

			canvas2.height.should.equal(500);
			canvas2.width.should.equal(500);
			canvas2.backgroundColor.should.equal('red');
			canvas2.backgroundImage.should.equal('');
		});
	});
});
