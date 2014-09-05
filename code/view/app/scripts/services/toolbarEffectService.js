'use strict';

angular.module('animatesEditor')
  .service('toolbarEffectService', function toolbarEffectService() {
    var registeredItems = {};

    function isTypeRegistered(type) {
      return (type && registeredItems[type] &&
        registeredItems[type].getButtonClass &&
        registeredItems[type].createEffect);
    }

    this.registerItem = function registerItem(type, getButtonClassFunction, createEffectFunction) {
      if (type && !isTypeRegistered(type) &&
          (typeof(getButtonClassFunction) === 'function') &&
          (typeof(createEffectFunction) === 'function')) {

        registeredItems[type] = {
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
      if (isTypeRegistered(type)) {
        return registeredItems[type].getButtonClass();
      }

      return '';
    };

    this.createEffect = function createEffect(type) {
      if (isTypeRegistered(type)) {
        return registeredItems[type].createEffect();
      }

      return undefined;
    };
  });
