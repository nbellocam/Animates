'use strict';

angular.module('animatesApp')
	.controller('LayoutCtrl', function LayoutCtrl($scope, canvasService) {
		angular.element(document).ready(function () {
			angular.element('body').layout({
				spacing: 0,
				'north__paneSelector': '.outer-layout-north',
				'center__paneSelector': '.outer-layout-center'
			});

			var innerLayout = angular.element('div.outer-layout-center').layout({
				applyDefaultStyles: false,
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

			canvasService.updateSize(innerLayout.state.center.innerHeight, innerLayout.state.center.innerWidth);
		});
	});
