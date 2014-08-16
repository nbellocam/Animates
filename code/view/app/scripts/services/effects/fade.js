'use strict';

angular.module('animatesApp')
  .run(function fade($windows) {
    var typeId = 'fade',
      Model = $window.model;

    function getButtonClass() {
      return 'fa fa-star-half-o';
    };

    function createEffect() {
      return new Model.FadeEffect();
    };

    //toolbarEffectService.registerItem(typeId, getButtonClass, createEffect)
  });
