'use strict';

angular.module('animatesEditor')
  .service('toolbarShapeService', function toolbarShapeService() {
    var registeredItems = {};

    function isTypeRegistered(type) {
      return (type && registeredItems[type] &&
        registeredItems[type].getButtonClass &&
        registeredItems[type].createMediaObject);
    }

    this.registerItem = function registerItem(type, getButtonClassFunction, createMediaObjectFunction) {
      if (type && !isTypeRegistered(type) &&
          (typeof(getButtonClassFunction) === 'function') &&
          (typeof(createMediaObjectFunction) === 'function')) {

        registeredItems[type] = {
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
      if (isTypeRegistered(type)) {
        return registeredItems[type].getButtonClass();
      }

      return '';
    };

    this.createMediaObject = function createMediaObject(type) {
      if (isTypeRegistered(type)) {
        return registeredItems[type].createMediaObject();
      }

      return undefined;
    };
  });
