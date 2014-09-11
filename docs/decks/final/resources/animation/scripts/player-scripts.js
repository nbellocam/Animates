'use strict';
angular.module('animatesPlayer', []);
'use strict';
angular.module('animatesPlayer').controller('PlayerCanvasCtrl', [
  'playerCanvasService',
  'playerLocalAnimationStateService',
  'playerShapeCreator',
  'playerAnimationService',
  function CanvasCtrl(playerCanvasService, playerLocalAnimationStateService, playerShapeCreator, playerAnimationService) {
    function onCurrentTickChanged(currentTick) {
      var frames = playerAnimationService.getInstance().timeline.getMediaFrames(currentTick);
      playerCanvasService.clear();
      playerCanvasService.stopAutomaticRendering();
      angular.forEach(frames, function (frame) {
        playerCanvasService.add(playerShapeCreator.createShapeFromFrame(frame));
      });
      playerCanvasService.render();
      playerCanvasService.startAutomaticRendering();
    }
    playerLocalAnimationStateService.addTickObserver('CanvasCtrl', onCurrentTickChanged);
  }
]);
'use strict';
angular.module('animatesPlayer').controller('PlayerCtrl', [
  '$scope',
  'playerAnimationService',
  'playerPresentationPlayerService',
  'playerCanvasService',
  'playerServerService',
  'playerLocalAnimationStateService',
  function ToolbarPanelCtrl($scope, playerAnimationService, playerPresentationPlayerService, playerCanvasService, playerServerService, playerLocalAnimationStateService) {
    $scope.loading = true;
    $scope.errorMessage = undefined;
    $scope.maxTick = 900;
    $scope.tick = 0;
    $scope.tickRatio = playerPresentationPlayerService.tickDuration();
    $scope.onTogglePlaying = function (playing) {
      if (playing) {
        playerPresentationPlayerService.play();
      } else {
        playerPresentationPlayerService.pause();
      }
    };
    function loadProject(animation) {
      if (animation !== undefined) {
        playerAnimationService.getInstance().loadProject(animation);
        playerCanvasService.createCanvas();
        playerLocalAnimationStateService.setCurrentTick(0);
        $scope.loading = false;
      }
    }
    $scope.initializeAnimation = function (projectId, project) {
      $scope.loading = true;
      if (projectId !== undefined) {
        playerServerService.loadProject(projectId, function success(data) {
          loadProject(data.animation);
        }, function error(data) {
          console.log('Error: ' + data);
          $scope.errorMessage = data || 'An error occurs.';
          $scope.loading = false;
        });
      } else {
        if (project !== undefined) {
          loadProject(project.animation);
        } else {
          $scope.$on('projectLoaded', function (event, project) {
            loadProject(project.animation);
          });
        }
      }
    };
    $scope.onTimelineTickChange = function (tick) {
      playerLocalAnimationStateService.setCurrentTick(tick);
      if (tick >= $scope.maxTick) {
        playerPresentationPlayerService.stop();
      }
    };
    $scope.onLocalStateTickChange = function (newVal) {
      if ($scope.tick !== newVal) {
        $scope.tick = newVal;
        if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
          $scope.$apply();
        }
      }
    };
    playerLocalAnimationStateService.addTickObserver('PlayerCtrl', $scope.onLocalStateTickChange);
  }
]);
'use strict';
angular.module('animatesPlayer').service('playerServerService', [
  '$http',
  '$window',
  '$timeout',
  function playerServerService($http, $window, $timeout) {
    function loadData(success, error) {
      var timeout = 100;
      // 10 seconds timeout
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'data.js';
      document.body.appendChild(script);
      function poll() {
        $timeout(function () {
          timeout--;
          if (typeof $window.animationData !== 'undefined') {
            success($window.animationData);
          } else if (timeout > 0) {
            poll();
          } else {
            error();
          }
        }, 100);
      }
      poll();
    }
    this.loadProject = function (id, success, error) {
      if (id === 'projectId') {
        loadData(success, error);
      } else if (id !== undefined) {
        $http.get('/api/projects/' + encodeURIComponent(id)).success(success).error(error);
      } else {
        error();
      }
    };
  }
]);
'use strict';
angular.module('animatesPlayer').service('playerAnimationService', [
  '$window',
  'playerCanvasConfig',
  function playerAnimationService($window, playerCanvasConfig) {
    var animationInstance, _self = this;
    this.Model = $window.model;
    this.isEditingEnable = true;
    function createAnimation() {
      var canvas = new _self.Model.Canvas({
          height: playerCanvasConfig.canvasDefaultSize.height,
          width: playerCanvasConfig.canvasDefaultSize.width
        }), timeline = new _self.Model.Timeline();
      animationInstance = new _self.Model.Animation({
        canvas: canvas,
        timeline: timeline
      });
      return animationInstance;
    }
    this.getInstance = function getInstance() {
      return animationInstance || createAnimation();
    };
  }
]);
'use strict';
angular.module('animatesPlayer').service('playerLocalAnimationStateService', [
  '$window',
  'playerAnimationService',
  function playerLocalAnimationStateService($window, playerAnimationService) {
    var currentTick = 0, tickObservers = {};
    playerAnimationService.getInstance().addLoadCompleteObserver('playerLocalAnimationStateService', function onAnimationLoad() {
      currentTick = -1;
    });
    this.addTickObserver = function addTickObserver(observerId, callback) {
      tickObservers[observerId] = callback;
    };
    this.setCurrentTick = function (tick) {
      var finalTick = tick >= 0 ? tick : 0;
      if (finalTick !== currentTick) {
        currentTick = finalTick;
        for (var observerId in tickObservers) {
          if (tickObservers.hasOwnProperty(observerId)) {
            tickObservers[observerId](currentTick);
          }
        }
      }
    };
    this.getCurrentTick = function () {
      return currentTick;
    };
  }
]);
'use strict';
angular.module('animatesPlayer').constant('playerCanvasConfig', {
  canvasInitialConfig: {
    backgroundColor: '#FFFFFF',
    selection: false,
    centeredRotation: true,
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
'use strict';
angular.module('animatesPlayer').service('playerPresentationPlayerService', [
  '$window',
  '$rootScope',
  'playerAnimationService',
  'playerLocalAnimationStateService',
  function playerCanvasService($window, $rootScope, playerAnimationService, playerLocalAnimationStateService) {
    var fps = 30, interval = 1000 / fps, timer = null, play = false, _self = this, playStart, frames, now, then = Date.now(), delta, tickDuration = 20;
    //miliseconds
    this.play = function () {
      var lastTick = playerLocalAnimationStateService.getCurrentTick(), startTick = lastTick;
      playStart = Date.now();
      frames = 0;
      function draw() {
        if (play) {
          timer = $window.requestAnimationFrame(draw);
          now = Date.now();
          delta = now - then;
          if (delta > interval) {
            frames++;
            then = now - delta % interval;
            var nextTick = Math.round((now - playStart) / tickDuration + startTick);
            if (nextTick !== lastTick) {
              playerLocalAnimationStateService.setCurrentTick(nextTick);
              lastTick = nextTick;
            }
          }
        }
      }
      if (!play) {
        play = true;
        playerAnimationService.isEditingEnable = false;
        draw();
      }
    };
    this.pause = function () {
      play = false;
      $window.cancelAnimationFrame(timer);
      timer = null;
      playerAnimationService.isEditingEnable = true;
    };
    this.stop = function () {
      _self.pause();
      playerLocalAnimationStateService.setCurrentTick(0);
    };
    this.tickDuration = function () {
      return tickDuration;
    };
  }
]);
'use strict';
angular.module('animatesPlayer').service('playerCanvasService', [
  '$window',
  '$rootScope',
  'playerCanvasConfig',
  'playerAnimationService',
  function playerCanvasService($window, $rootScope, playerCanvasConfig, playerAnimationService) {
    var fabric = $window.fabric, canvasInstance;
    this.createCanvas = function createCanvas() {
      var canvas = new fabric.StaticCanvas('playerCanvas', playerCanvasConfig.canvasInitialConfig);
      canvas.model = playerAnimationService.getInstance().canvas;
      canvas.setHeight(canvas.model.height);
      canvas.setWidth(canvas.model.width);
      // TODO: Update Properties
      canvas.on('after:render', function () {
        canvas.calcOffset();
      });
      canvasInstance = canvas;
    };
    this.getInstance = function getInstance() {
      return canvasInstance;
    };
    this.add = function add(element) {
      canvasInstance.add(element);
    };
    this.clear = function clear() {
      if (canvasInstance) {
        canvasInstance.clear();
      }
    };
    this.stopAutomaticRendering = function () {
      canvasInstance.renderOnAddRemove = false;
    };
    this.startAutomaticRendering = function () {
      canvasInstance.renderOnAddRemove = true;
    };
    this.render = function () {
      canvasInstance.renderAll();
    };
  }
]);
'use strict';
angular.module('animatesPlayer').directive('animatesPlayertimeline', [
  '$timeout',
  '$document',
  '$window',
  function ($timeout, $document, $window) {
    return {
      restrict: 'E',
      template: '<span class="timetooltip"></span>' + '<div class="timelines-tick-navigator" style="width:{{width}}px;" >' + '<div class="timeline-controls" ng-click="tooglePlay()" >' + '<span class="glyphicon player-button" ng-class="{\'glyphicon-pause\': playing, \'glyphicon-play\': !playing}"></span>' + '</div>' + '<div class="tickHandlerScrollerContainer" style="width:{{rulerWidth}}px;" >' + '<div class="tickHandlerContainer" style="width:{{rulerWidth}}px;">' + '<div class="ruler" style="width:{{tick}}px;"></div>' + '<div class="tickHandler" style="left:{{tick}}px;"></div>' + '</div>' + '</div>' + '</div>',
      scope: {
        externalTick: '=tick',
        tickChange: '&',
        onToggleplaying: '&',
        tickRatio: '=',
        width: '=',
        maxTick: '='
      },
      controller: [
        '$scope',
        '$element',
        function ($scope, $element) {
          var timelineControls = angular.element($element[0].querySelector('.timeline-controls'));
          $scope.playing = $scope.playing || false;
          $scope.tick = $scope.externalTick;
          $scope.maxTick = $scope.maxTick || 5000;
          $scope.width = $scope.width || 500;
          $scope.rulerWidth = $scope.width - timelineControls.width() - 4;
          $scope.tickRate = $window.Math.round($scope.maxTick / $scope.rulerWidth);
          $scope.tooglePlay = function () {
            $scope.playing = !$scope.playing;
            $scope.onToggleplaying({ playing: $scope.playing });
          };
          $scope.$watch('externalTick', function () {
            $scope.tick = $scope.externalTick / $scope.tickRate;
            if ($scope.tickChange) {
              $scope.tickChange({ tick: $scope.externalTick });
            }
          });
          $scope.getTime = function (tick) {
            return tick * $scope.tickRatio / 1000;
          };
          $scope.formatTime = function (tick) {
            if ($scope.tickRatio) {
              var totalSeconds = $scope.getTime(tick * $scope.tickRate), hours = Math.floor(totalSeconds / 3600), minutes = Math.floor((totalSeconds - hours * 3600) / 60), seconds = totalSeconds - hours * 3600 - minutes * 60;
              seconds = seconds.toFixed(3);
              if (hours < 10) {
                hours = '0' + hours;
              }
              if (minutes < 10) {
                minutes = '0' + minutes;
              }
              if (seconds < 10) {
                seconds = '0' + seconds;
              }
              return hours + ':' + minutes + ':' + seconds;
            } else {
              return 'Tick: ' + tick;
            }
          };
          $scope.internalTickChange = function () {
            $scope.$apply(function () {
              $scope.externalTick = $scope.tick * $scope.tickRate;
            });
            if ($scope.tickChange) {
              $scope.tickChange({ tick: $scope.externalTick });
            }
          };
        }
      ],
      link: {
        post: function ($scope, element) {
          var x, originalTick, tickHandlerElement = angular.element(element[0].querySelector('.tickHandler')), tooltipElement = angular.element(element[0].querySelector('.timetooltip')), tickHandlerScrollerContainerElement = angular.element(element[0].querySelector('.tickHandlerScrollerContainer')), bodyElement = angular.element($document[0].querySelector('body'));
          element.css('width', $scope.width);
          // append the tooltip to the body so it can be display above any element.
          tooltipElement.remove();
          bodyElement.append(tooltipElement);
          function setTick(newTick) {
            $scope.$apply(function () {
              if (newTick < 0) {
                $scope.tick = 0;
              } else if (newTick >= $scope.maxTick) {
                $scope.tick = $scope.maxTick;
              } else {
                $scope.tick = newTick;
              }
            });
            originalTick = newTick;
            $scope.internalTickChange();
          }
          function getRect(element) {
            return element[0].getBoundingClientRect();
          }
          function followMouse(evt) {
            var rect = getRect(tickHandlerScrollerContainerElement), currentTick = evt.pageX - rect.left;
            tooltipElement.html($scope.formatTime(currentTick));
            tooltipElement.css({
              'left': evt.pageX - tooltipElement.prop('offsetWidth') / 2 + 'px',
              'top': evt.pageY - 5 - tooltipElement.prop('offsetHeight') + 'px'
            });
            tooltipElement.addClass('active');
          }
          tickHandlerScrollerContainerElement.on('mousedown', function () {
            if (!$scope.isDisable) {
              var rect = getRect(tickHandlerScrollerContainerElement);
              setTick(event.pageX - rect.left);
            }
          });
          tickHandlerScrollerContainerElement.on('mouseover', function (event) {
            followMouse(event);
            $document.on('mousemove', followMouse);
          });
          tickHandlerScrollerContainerElement.on('mouseout', function () {
            $document.unbind('mousemove', followMouse);
            tooltipElement.removeClass('active');
          });
          tickHandlerElement.on('mousedown', function (event) {
            if (!$scope.playing) {
              tickHandlerElement.addClass('moving');
              // Prevent default dragging of selected content
              event.preventDefault();
              event.stopPropagation();
              x = event.pageX - $scope.tick;
              originalTick = $scope.tick;
              $document.on('mousemove', tickHandlerMove);
              $document.on('mouseup', tickHandlerMoveEnd);
            }
          });
          function tickHandlerMove(event) {
            // Move the tick to the new position
            setTick(event.pageX - x);
          }
          function tickHandlerMoveEnd() {
            $document.unbind('mousemove', tickHandlerMove);
            $document.unbind('mouseup', tickHandlerMoveEnd);
            if (originalTick !== $scope.tick) {
              $scope.internalTickChange();
            }
            tickHandlerElement.removeClass('moving');
          }
        }
      }
    };
  }
]);
'use strict';
angular.module('animatesPlayer').service('playerShapeCreator', [
  'playerLocalAnimationStateService',
  'playerShapeSync',
  'playerShapeHelper',
  function playerShapeCreator(playerLocalAnimationStateService, playerShapeSync, playerShapeHelper) {
    var registeredShapes = {}, _self = this;
    function isTypeRegistered(type) {
      return type && registeredShapes[type] && typeof registeredShapes[type] === 'function';
    }
    this.registerShape = function registerShape(type, creationFunction) {
      if (type && !isTypeRegistered(type) && typeof creationFunction === 'function') {
        registeredShapes[type] = creationFunction;
      }
    };
    this.createShapeFromFrame = function createShapeFromFrame(mediaFrame) {
      if (mediaFrame) {
        var type = mediaFrame.getMediaObjectType();
        if (isTypeRegistered(type)) {
          var shape = registeredShapes[type](mediaFrame.getMediaObjectGuid());
          shape.setOriginX('center');
          shape.setOriginY('center');
          playerShapeHelper.setModelInView(mediaFrame, shape);
          playerShapeSync.syncFromModel(shape);
          return shape;
        }
      }
      return undefined;
    };
    this.createShapeFromMediaTime = function createShapeFromMediaTime(mediaTimeline) {
      var shape = _self.createShapeFromFrame(mediaTimeline.getMediaFrameFor(playerLocalAnimationStateService.getCurrentTick()));
      shape.setOriginX('center');
      shape.setOriginY('center');
      return shape;
    };
  }
]);
'use strict';
angular.module('animatesPlayer').service('playerShapeSync', [
  'playerShapeHelper',
  function playerShapeSync(playerShapeHelper) {
    var registeredShapes = {};
    function isTypeRegistered(type) {
      return type && registeredShapes[type] && registeredShapes[type].syncFromModel;
    }
    this.registerShape = function registerShape(type, syncFromModelFunction) {
      if (type && !isTypeRegistered(type) && typeof syncFromModelFunction === 'function') {
        registeredShapes[type] = { syncFromModel: syncFromModelFunction };
      }
    };
    this.syncFromModel = function syncFromModel(fabricObject) {
      var type = playerShapeHelper.getTypeFromView(fabricObject);
      if (isTypeRegistered(type)) {
        registeredShapes[type].syncFromModel(fabricObject);
      }
    };
  }
]);
'use strict';
angular.module('animatesPlayer').factory('playerShapeHelper', [
  'playerAnimationService',
  'playerLocalAnimationStateService',
  function playerShapeHelper(playerAnimationService, playerLocalAnimationStateService) {
    var getGuidFromView = function getGuidFromView(viewObject) {
        return viewObject && viewObject.model && viewObject.model.guid;
      }, getTypeFromView = function getTypeFromView(viewObject) {
        return viewObject && viewObject.model && viewObject.model.type;
      }, setModelInView = function setModelInView(modelObject, viewObject) {
        viewObject.model = {
          type: modelObject.getMediaObjectType() || modelObject.getType(),
          guid: modelObject.getMediaObjectGuid() || modelObject.getGuid()
        };
      }, getMediaTimelineFromView = function getMediaTimelineFromView(viewObject) {
        var guid = getGuidFromView(viewObject);
        return guid ? playerAnimationService.getInstance().timeline.getMediaTimeline(guid) : undefined;
      }, getMediaObjectFromView = function getMediaObjectFromView(viewObject) {
        var mediaTimeline = getMediaTimelineFromView(viewObject);
        return mediaTimeline ? mediaTimeline.getMediaObject() : undefined;
      }, getMediaFrameFromView = function getMediaFrameFromView(viewObject) {
        var mediaTimeline = getMediaTimelineFromView(viewObject);
        if (mediaTimeline) {
          return mediaTimeline.getMediaFrameFor(playerLocalAnimationStateService.getCurrentTick());
        }
        return undefined;
      };
    return {
      getGuidFromView: getGuidFromView,
      getTypeFromView: getTypeFromView,
      setModelInView: setModelInView,
      getMediaTimelineFromView: getMediaTimelineFromView,
      getMediaObjectFromView: getMediaObjectFromView,
      getMediaFrameFromView: getMediaFrameFromView
    };
  }
]);
'use strict';
angular.module('animatesPlayer').factory('playerShapeSyncHelper', [
  '$window',
  'playerShapeHelper',
  function playerShapeSyncHelper($window, playerShapeHelper) {
    var syncViewProperty = function syncViewProperty(modelValue, viewObject, propertyName) {
        var fabricProperty = viewObject.get(propertyName);
        if (modelValue !== fabricProperty) {
          viewObject.set(propertyName, modelValue);
        }
      }, syncVisualMediaObjectFromModel = function syncVisualMediaObjectFromModel(viewObject) {
        var model = playerShapeHelper.getMediaFrameFromView(viewObject);
        syncViewProperty(model.getProperty('border.color'), viewObject, 'stroke');
        syncViewProperty(model.getProperty('border.width'), viewObject, 'strokeWidth');
        switch (model.getProperty('border.type')) {
        case 'none':
          syncViewProperty(null, viewObject, 'stroke');
          break;
        case 'dashed':
          syncViewProperty([
            3,
            3
          ], viewObject, 'strokeDashArray');
          break;
        case 'dotted':
          syncViewProperty([
            1,
            2
          ], viewObject, 'strokeDashArray');
          break;
        case 'solid':
        default:
          syncViewProperty([
            0,
            0
          ], viewObject, 'strokeDashArray');
        }
        syncViewProperty(model.getProperty('fill'), viewObject, 'fill');
        syncViewProperty(model.getProperty('opacity'), viewObject, 'opacity');
        syncViewProperty(model.getProperty('angle'), viewObject, 'angle');
        syncViewProperty(model.getProperty('position.x'), viewObject, 'left');
        syncViewProperty(model.getProperty('position.y'), viewObject, 'top');
        viewObject.zindex = model.getProperty('position.z') + 1;
      };
    return {
      Fabric: $window.fabric,
      syncViewProperty: syncViewProperty,
      syncVisualMediaObjectFromModel: syncVisualMediaObjectFromModel
    };
  }
]);
'use strict';
angular.module('animatesPlayer').run([
  'playerShapeCreator',
  'playerShapeSync',
  'playerShapeSyncHelper',
  'playerShapeHelper',
  function rectangle(playerShapeCreator, playerShapeSync, playerShapeSyncHelper, playerShapeHelper) {
    var typeId = 'Rectangle';
    function createShape() {
      return new playerShapeSyncHelper.Fabric.Rect();
    }
    playerShapeCreator.registerShape(typeId, createShape);
    function syncFromModel(viewObject) {
      var model = playerShapeHelper.getMediaFrameFromView(viewObject);
      playerShapeSyncHelper.syncVisualMediaObjectFromModel(viewObject);
      playerShapeSyncHelper.syncViewProperty(model.getProperty('height'), viewObject, 'height');
      playerShapeSyncHelper.syncViewProperty(model.getProperty('width'), viewObject, 'width');
    }
    ;
    playerShapeSync.registerShape(typeId, syncFromModel);
  }
]);
'use strict';
angular.module('animatesPlayer').run([
  'playerShapeCreator',
  'playerShapeSync',
  'playerShapeSyncHelper',
  'playerShapeHelper',
  function triangle(playerShapeCreator, playerShapeSync, playerShapeSyncHelper, playerShapeHelper) {
    var typeId = 'Triangle';
    function createShape() {
      return new playerShapeSyncHelper.Fabric.Triangle();
    }
    playerShapeCreator.registerShape(typeId, createShape);
    function syncFromModel(viewObject) {
      var model = playerShapeHelper.getMediaFrameFromView(viewObject);
      playerShapeSyncHelper.syncVisualMediaObjectFromModel(viewObject);
      playerShapeSyncHelper.syncViewProperty(model.getProperty('height'), viewObject, 'height');
      playerShapeSyncHelper.syncViewProperty(model.getProperty('width'), viewObject, 'width');
    }
    ;
    playerShapeSync.registerShape(typeId, syncFromModel);
  }
]);
'use strict';
angular.module('animatesPlayer').run([
  'playerShapeCreator',
  'playerShapeSync',
  'playerShapeSyncHelper',
  'playerShapeHelper',
  function circle(playerShapeCreator, playerShapeSync, playerShapeSyncHelper, playerShapeHelper) {
    var typeId = 'Circle';
    function createShape() {
      var shape = new playerShapeSyncHelper.Fabric.Circle();
      shape.setOptions({ 'lockUniScaling': true });
      return shape;
    }
    playerShapeCreator.registerShape(typeId, createShape);
    function syncFromModel(viewObject) {
      var model = playerShapeHelper.getMediaFrameFromView(viewObject);
      playerShapeSyncHelper.syncVisualMediaObjectFromModel(viewObject);
      playerShapeSyncHelper.syncViewProperty(model.getProperty('radius'), viewObject, 'radius');
    }
    ;
    playerShapeSync.registerShape(typeId, syncFromModel);
  }
]);
'use strict';
angular.module('animatesPlayer').run([
  'playerShapeCreator',
  'playerShapeSync',
  'playerShapeSyncHelper',
  'playerShapeHelper',
  function text(playerShapeCreator, playerShapeSync, playerShapeSyncHelper, playerShapeHelper) {
    var typeId = 'Text';
    function createShape() {
      var text = new playerShapeSyncHelper.Fabric.IText('Text');
      // lock x and y scaling to be consistent with the font type
      // fabric does not allow to change the height and width
      // directly you must do it by chaging the
      text.lockScalingY = true;
      text.lockScalingX = true;
      return text;
    }
    playerShapeCreator.registerShape(typeId, createShape);
    function syncFromModel(viewObject) {
      var model = playerShapeHelper.getMediaFrameFromView(viewObject);
      playerShapeSyncHelper.syncVisualMediaObjectFromModel(viewObject);
      playerShapeSyncHelper.syncViewProperty(model.getProperty('fontSize'), viewObject, 'fontSize');
      playerShapeSyncHelper.syncViewProperty(model.getProperty('fontFamily'), viewObject, 'fontFamily');
      playerShapeSyncHelper.syncViewProperty(model.getProperty('fontStyle'), viewObject, 'fontStyle');
      playerShapeSyncHelper.syncViewProperty(model.getProperty('textDecoration'), viewObject, 'textDecoration');
      playerShapeSyncHelper.syncViewProperty(model.getProperty('text'), viewObject, 'text');
    }
    ;
    playerShapeSync.registerShape(typeId, syncFromModel);
  }
]);
'use strict';
angular.module('animatesPlayer').run([
  'playerShapeCreator',
  'playerShapeSync',
  'playerShapeSyncHelper',
  'playerShapeHelper',
  'playerCanvasService',
  function triangle(playerShapeCreator, playerShapeSync, playerShapeSyncHelper, playerShapeHelper, playerCanvasService) {
    var typeId = 'Photo';
    var oImg = document.createElement('img');
    oImg.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D');
    var imagesCache = {};
    function createShape(mediaObjectGuid) {
      var element = imagesCache[mediaObjectGuid];
      if (element) {
        return new playerShapeSyncHelper.Fabric.Image(element);
      }
      return new playerShapeSyncHelper.Fabric.Image(oImg);
    }
    playerShapeCreator.registerShape(typeId, createShape);
    function syncFromModel(viewObject) {
      var model = playerShapeHelper.getMediaFrameFromView(viewObject);
      if (model) {
        var source = model.getProperty('source');
        var element = viewObject.getElement();
        if (source && element.src !== source) {
          var newImageElement = document.createElement('img');
          newImageElement.onload = function () {
            imagesCache[playerShapeHelper.getGuidFromView(viewObject)] = newImageElement;
            viewObject.setElement(newImageElement);
            playerShapeSyncHelper.syncVisualMediaObjectFromModel(viewObject);
            playerShapeSyncHelper.syncViewProperty(model.getProperty('height'), viewObject, 'height');
            playerShapeSyncHelper.syncViewProperty(model.getProperty('width'), viewObject, 'width');
            viewObject.setCoords();
            playerCanvasService.getInstance().renderAll();
          };
          newImageElement.setAttribute('src', source);
        } else {
          playerShapeSyncHelper.syncVisualMediaObjectFromModel(viewObject, canvasPosition);
          playerShapeSyncHelper.syncViewProperty(model.getProperty('height'), viewObject, 'height');
          playerShapeSyncHelper.syncViewProperty(model.getProperty('width'), viewObject, 'width');
        }
      }
    }
    ;
    playerShapeSync.registerShape(typeId, syncFromModel);
  }
]);
