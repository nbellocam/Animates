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
			rect : {
				fill: '#FFF',
				evented: false,
				opacity: 1,
				selectable: false,
				strokeWidth: 1,
				stroke: '#BBB'
			},
			shadow : {
				color: 'rgba(0,0,0,0.6)',
				blur: 7,
				opacity: 0.4,
				fillShadow: true,
				strokeShadow: true
			}
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
