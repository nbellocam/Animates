'use strict';

var Canvas = require('./canvas'),
	Timeline = require('./timeline'),
	MediaTimeline = require('./mediaTimeline'),
	JsonSerializer = require('./serialization/jsonSerializer'),
	Common = require('animates-common');

/**
 *  Creates a new Animation.
 *  @class Represents an Animation.
 */
function Animation (options) {
	options = options || {};

	var _self = this, // Save the this reference for later use
		updateObservers = {},
		loadCompleteObservers = {};

	/**
	*  Constructor
	*/
	(function preInit() {
		_self.canvas = options.canvas || new Canvas();
		_self.timeline = options.timeline || new Timeline();
	}());

	function getResultObject () {
		return { status : false, data : {} };
	}

	function applyShapeCreateOperation(opParams) {
		var mediaTimeline,
			result = getResultObject();

		mediaTimeline = _self.timeline.addMediaObject(opParams.mediaObject);

		if (mediaTimeline) {
			result.status = true;
			result.data = opParams;
			result.data.mediaTimeline = mediaTimeline.toJSON();
			result.target = 'MediaTimeline';
		}

		return result;
	}

	function applyShapeRemoveOperation(opParams) {
		var mediaTimeline = new MediaTimeline(),
			result = getResultObject();

		if (_self.timeline.getMediaTimeline(opParams.mediaObjectId)) {
			_self.timeline.removeMediaObject(opParams.mediaObjectId);
			result.status = true;
			result.data = opParams;
			result.target = 'MediaTimeline';
		}

		return result;
	}

	function applyMediaTimelineCreateOperation(opParams) {
		var mediaTimeline = new MediaTimeline(),
			result = getResultObject();

		mediaTimeline.fromJSON(opParams.mediaTimeline);
		mediaTimeline = _self.timeline.addMediaTimeline(mediaTimeline);

		if (mediaTimeline) {
			result.status = true;
			result.data = opParams;
		}

		return result;
	}

	function applyMediaTimelineRemoveOperation(opParams) {
		var result = getResultObject();

		if (_self.timeline.getMediaTimeline(opParams.mediaObjectId)) {
			_self.timeline.removeMediaObject(opParams.mediaObjectId);
			result.status = true;
			result.data = opParams;
		}

		return result;
	}

	function applyEffectCreateOperation(opParams) {
		var mediaTimeline = _self.timeline.getMediaTimeline(opParams.mediaObjectId),
			result = getResultObject();

		if (mediaTimeline) {
			mediaTimeline.addEffect(opParams.effect);
			result.status = true;
			result.data = opParams;
		}

		return result;
	}

	function applyEffectUpdateOperation(opParams) {
		var mediaTimeline = _self.timeline.getMediaTimeline(opParams.mediaObjectId),
			result = getResultObject();

		if (mediaTimeline) {
			var effect = mediaTimeline.getEffect(opParams.effectId);

			if (effect) {
				effect.setOptions(opParams.options);
				result.status = true;
				result.data = opParams;
			}
		}

		return result;
	}

	function applyEffectRemoveOperation(opParams) {
		var mediaTimeline = _self.timeline.getMediaTimeline(opParams.mediaObjectId),
			result = getResultObject();

		if (mediaTimeline && mediaTimeline.getEffect(opParams.effectId)) {
			mediaTimeline.removeEffect(opParams.effectId);
			result.status = true;
			result.data = opParams;
		}

		return result;
	}

	function applyMediaFrameUpdateOperation(opParams) {
		var mediaTimeline = _self.timeline.getMediaTimeline(opParams.mediaObjectId),
			newProperty, updateResult, notUpdatedProperties,
			result = getResultObject();

		if (mediaTimeline) {
			updateResult = mediaTimeline.updateEffectsThatMatch(opParams.tick, opParams.updatedProperties);
			notUpdatedProperties = Common.filterObject(opParams.updatedProperties, updateResult.pendingProperties, true);

			if (updateResult.newProperties) {
				for(newProperty in updateResult.newProperties) {
					opParams.updatedProperties[newProperty] = updateResult.newProperties[newProperty];
				}
			}

			if (!Common.isEmpty(notUpdatedProperties)) {
				var mediaObject = mediaTimeline.getMediaObject();
				mediaObject.setProperties(notUpdatedProperties);
			}

			result.status = true;
			result.data = opParams;
		}

		return result;
	}

	function applyShapeOperation(operation, opParams) {
		switch (operation) {
			case 'Create':
				return applyShapeCreateOperation(opParams);
			case 'Remove':
				return applyShapeRemoveOperation(opParams);
			default:
				return getResultObject();
		}
	}

	function applyMediaTimelineOperation(operation, opParams) {
		switch (operation) {
			case 'Create':
				return applyMediaTimelineCreateOperation(opParams);
			case 'Remove':
				return applyMediaTimelineRemoveOperation(opParams);
			default:
				return getResultObject();
		}
	}

	function applyEffectOperation(operation, opParams) {
		switch (operation) {
			case 'Create':
				return applyEffectCreateOperation(opParams);
			case 'Update':
				return applyEffectUpdateOperation(opParams);
			case 'Remove':
				return applyEffectRemoveOperation(opParams);
			default:
				return getResultObject();
		}
	}

	function applyMediaFrameOperation(operation, opParams) {
		switch (operation) {
			case 'Update':
				return applyMediaFrameUpdateOperation(opParams);
			default:
				return getResultObject();
		}
	}

	this.applyOperation = function applyOperation(target, operation, opParams, context) {
		var result = getResultObject(),
			params;

		if (target && operation && opParams) {
			switch (target) {
				case 'Shape':
					result = applyShapeOperation(operation, opParams);
					break;
				case 'MediaTimeline':
					result = applyMediaTimelineOperation(operation, opParams);
					break;
				case 'Effect':
					result = applyEffectOperation(operation, opParams);
					break;
				case 'MediaFrame':
					result = applyMediaFrameOperation(operation, opParams);
					break;
				default:
					return;
			}

			if (result.status) {
				target = result.target || target;
				operation = result.operation || operation;
				params = result.data || opParams;

				for (var observerId in updateObservers) {
					if (updateObservers.hasOwnProperty(observerId)) {
						if (!context || !context.sender || context.sender !== observerId) {
							updateObservers[observerId](target, operation, params, context);
						}
					}
				}
			}
		}
	};

	this.addUpdateObserver = function addUpdateObserver(observerId, observerFunction) {
		updateObservers[observerId] = observerFunction;
	};

	this.removeUpdateObserver = function removeUpdateObserver(observerId) {
		if (updateObservers.hasOwnProperty(observerId)) {
			delete updateObservers[observerId];
		}
	};

	this.addLoadCompleteObserver = function addLoadCompleteObserver(observerId, observerFunction) {
		loadCompleteObservers[observerId] = observerFunction;
	};

	this.removeLoadCompleteObserver = function removeLoadCompleteObserver(observerId) {
		if (loadCompleteObservers.hasOwnProperty(observerId)) {
			delete loadCompleteObservers[observerId];
		}
	};

	this.loadProject = function loadProject(json) {
		if (json && json.type && json.data) {
			var animationData = json.data;
			if (animationData.timeline.type && animationData.timeline.data) {
				_self.timeline.fromJSON(animationData.timeline.data);
			}

			if (animationData.canvas.type && animationData.canvas.data) {
				_self.canvas.fromJSON(animationData.canvas.data);
			}

			for(var observerId in loadCompleteObservers) {
				if (loadCompleteObservers.hasOwnProperty(observerId)) {
					loadCompleteObservers[observerId]();
				}
			}
		}
	};

	this.toJSON = function () {
		var ser =	{
						'canvas' : JsonSerializer.serializeObject(_self.canvas),
						'timeline' : JsonSerializer.serializeObject(_self.timeline)
					};

		return ser;
	};

	this.fromJSON = function (json) {
		_self.timeline = JsonSerializer.deserializeObject(json.timeline);
		_self.canvas = JsonSerializer.deserializeObject(json.canvas);
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

JsonSerializer.registerType(Animation);

module.exports = Animation;
