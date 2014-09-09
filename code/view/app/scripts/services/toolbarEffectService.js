'use strict';

angular.module('animatesEditor')
  .service('toolbarEffectService', function toolbarEffectService() {
    var registeredItems = {};

    function isTypeRegistered(type) {
      return (type && registeredItems[type.trim()] &&
        registeredItems[type.trim()].getButtonClass &&
        registeredItems[type.trim()].createEffect);
    }

    this.registerItem = function registerItem(type, getButtonClassFunction, createEffectFunction) {
      if (type && !isTypeRegistered(type.trim()) &&
          (typeof(getButtonClassFunction) === 'function') &&
          (typeof(createEffectFunction) === 'function')) {

        registeredItems[type.trim()] = {
          getButtonClass: getButtonClassFunction,
          createEffect: createEffectFunction
        };
      }
    };

    this.getRegisteredTypes = function getRegisteredTypes() {
      var registeredTypes = [];

      for (var type in registeredItems) {
        if (registeredItems.hasOwnProperty(type)) {
          registeredTypes.push(type);
        }
      }

      return registeredTypes;
    };

    this.getButtonClass = function getButtonClass(type) {
      if (isTypeRegistered(type.trim())) {
        return registeredItems[type.trim()].getButtonClass();
      }

      return '';
    };

    this.createEffect = function createEffect(type) {
      if (isTypeRegistered(type.trim())) {
        return registeredItems[type.trim()].createEffect();
      }

      return undefined;
    };
  });
