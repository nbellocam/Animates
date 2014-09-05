'use strict';

angular.module('animatesEditor')
  .run(function fade(toolbarEffectService, effectHelper) {
    var typeId = 'fade';

    function getButtonClass() {
      return 'fa fa-star-half-o';
    };

    function createEffect() {
      return new effectHelper.Model.FadeEffect();
    };

    toolbarEffectService.registerItem(typeId, getButtonClass, createEffect)
  });
