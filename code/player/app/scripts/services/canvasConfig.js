'use strict';

angular.module('animatesPlayer')
	.constant('canvasConfig', {
		canvasInitialConfig: {
			backgroundColor: '#FFFFFF',
			selection : false,
			centeredRotation : true,
			centeredScaling: true
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
