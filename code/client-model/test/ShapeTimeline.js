/*global require, describe, it */

var ShapeTimeline = require('../src/ShapeTimeline'),
	should = require("should");

describe('ShapeTimeline', function(){
	describe('AnimationsCollections', function(){
		it('Should not contain any animation when created', function(){
			var shapeTimeline = new ShapeTimeline(),
				animations = shapeTimeline.getAnimations();

			animations.should.be.empty;
		});

		it('Should add a new animation', function(){
			var shapeTimeline = new ShapeTimeline(),
				animations,
				animation = { property: "value" },
				animationId = 'myId';

			shapeTimeline.addAnimation(animationId, animation);
			animations = shapeTimeline.getAnimations();

			animations.should.not.be.empty;
			animations.should.have.property(animationId);
		});

		it('Should not add a new animation with invalid id', function(){
			var shapeTimeline = new ShapeTimeline(),
				animations,
				animation = { property: "value" },
				animationId;

			shapeTimeline.addAnimation(animationId, animation);
			animations = shapeTimeline.getAnimations();

			animations.should.be.empty;
		});

		it('Should not add a new invalid animation', function(){
			var shapeTimeline = new ShapeTimeline(),
				animations,
				animation,
				animationId = 'myId';

			shapeTimeline.addAnimation(animationId, animation);
			animations = shapeTimeline.getAnimations();

			animations.should.be.empty;
		});

		it('Should remove an animation', function(){
			var shapeTimeline = new ShapeTimeline(),
				animations,
				animation = { property: "value" },
				animationId = 'myId';

			shapeTimeline.addAnimation(animationId, animation);
			shapeTimeline.removeAnimation(animationId);
			animations = shapeTimeline.getAnimations();

			animations.should.be.empty;
		});

		it('Should not fail to remove a not existing animation', function(){
			var shapeTimeline = new ShapeTimeline(),
				animations,
				animationId = 'myId';

			shapeTimeline.removeAnimation(animationId);
			animations = shapeTimeline.getAnimations();

			animations.should.be.empty;
		});

		it('Should not fail a call to remove with no parameter', function(){
			var shapeTimeline = new ShapeTimeline(),
				animations

			shapeTimeline.removeAnimation();
			animations = shapeTimeline.getAnimations();

			animations.should.be.empty;
		});
	});
});
