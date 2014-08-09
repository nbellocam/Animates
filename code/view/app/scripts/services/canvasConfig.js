'use strict';

angular.module('animatesApp')
	.constant('canvasConfig', {
		canvasInitialConfig: {
			backgroundColor: '#F3F3F3',
			selection : false,
			centeredRotation : true,
			centeredScaling: true,
		},
		viewportInitialConfig: {
			fill: '#FFF',
			evented: false,
			opacity: 1,
			selectable: false,
			strokeWidth: 2,
			stroke: '#BBB'
		},
		canvasMinPosition: {
			top: 100,
			left: 100
		},
		canvasDefaultSize: {
			height: 400,
			width: 600
		}
	});
