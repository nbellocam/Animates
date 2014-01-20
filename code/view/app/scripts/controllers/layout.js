'use strict';

angular.module('animatesApp')
	.controller('LayoutCtrl', function ($scope, canvasService) {
		angular.element(document).ready(function () {
			var layout = angular.element('body').layout({
				applyDefaultStyles: true,
				west:{
					size: 60,
					resizable:false
				},
				center: {
					onresize : function (panelName, element, state){
						canvasService.updateSize(state.innerHeight, state.innerWidth);
					}
				}
			});

			canvasService.updateSize(layout.state.center.innerHeight, layout.state.center.innerWidth);
		});
	});
