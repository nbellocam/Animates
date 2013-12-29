'use strict';

/**
 *  Creates a new ClassTimeManager.
 *  @class Represents a TimeManager . 
 */
function TimeManager (options) {
	var _self = this, // Save the this reference for later use
		frameRate = options.frameRate || 1000,
		currentFrame = -1,
		isPlaying = false,
		tickObservers = [];

	/**
	 * Calls all the existing observers
	 */
	function callObservers() {
		var initialFrame = currentFrame,
			i;
		for (i = tickObservers.length - 1; i >= 0; i--) {
			tickObservers[i](initialFrame);

			// TODO should wait for all ticks to end
			if (initialFrame !== currentFrame) {
				// TODO should update the frameRate variable and change the cicle to adjust
				// The cicle didn't complete within a frame
			}
		}

		// TODO should wait for all ticks to end
		if (initialFrame === currentFrame) {
			// TODO should update the frameRate variable and change the cicle to adjust
			// The cicle complete suscesfully during a cicle. Try to reduce it, it may be a be too long.
			// Note that this must be within a range in order not to reduce it permantly.
		}
	}

	/**
	 * Start the actual "time" loop
	 */
	function startLoop() {
		setTimeout (function () {
			if (isPlaying) {
				callObservers();
				currentFrame++;
			}
		}, frameRate);
	}

	/**
	 * Start playing the current time loop.
	 */
	this.play = function () {
		if (currentFrame === -1) {
			startLoop();
		}

		isPlaying = true;
	};

	/**
	 * Stop playing the current time loop.
	 */
	this.stop = function () {
		isPlaying = false;
	};

	/**
	 * Set the current frame to the one passed as parameter
	 * @param {integer} frame The frame to be setted.
	 */
	this.goToFrame = function (frame) {
		currentFrame = frame;
		callObservers();
	};

	/**
	 * Add a new tick observer function
	 * @param {integer} tickObserverId The function id that will be used to remove it from the collection.
	 * @param {function} tickObserverFunction The function that will be called. This function must recive the current frame as parameter.
	 */
	this.addTickObserver = function (tickObserverId, tickObserverFunction) {
		if (!isPlaying) {
			tickObservers[tickObserverId] = tickObserverFunction;
		}
	};

	/**
	 * Remove a tick observer function
	 * @param {integer} tickObserverId The function id that was used when it was added.
	 */
	this.removeTickObserver = function (tickObserverId) {
		if (!isPlaying) {
			// TODO review if it needed to check to be present in the collection
			delete tickObservers[tickObserverId];
		}
	};

	/**
	 * Constructor
	 */
	(function init() {
	}());
}

module.exports = TimeManager;
