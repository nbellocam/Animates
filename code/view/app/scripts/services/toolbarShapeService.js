'use strict';

angular.module('animatesEditor')
  .service('toolbarShapeService', function toolbarShapeService() {
    var registeredItems = {};

    function isTypeRegistered(type) {
      return (type && registeredItems[type.trim()] &&
        registeredItems[type.trim()].getButtonClass &&
        registeredItems[type.trim()].createMediaObject);
    }

    this.registerItem = function registerItem(type, getButtonClassFunction, createMediaObjectFunction) {
      if (type && !isTypeRegistered(type.trim()) &&
          (typeof(getButtonClassFunction) === 'function') &&
          (typeof(createMediaObjectFunction) === 'function')) {

        registeredItems[type.trim()] = {
          getButtonClass: getButtonClassFunction,
          createMediaObject: createMediaObjectFunction
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

    this.createMediaObject = function createMediaObject(type) {
      if (isTypeRegistered(type.trim())) {
        return registeredItems[type.trim()].createMediaObject();
      }

      return undefined;
    };
  });
