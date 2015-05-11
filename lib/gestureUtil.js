;gestureUtil = (function() {


var getCenter = function (touches) {
	var valuesX = [], valuesY = [];

	for(var t= 0,len=touches.length; t<len; t++) {
		valuesX.push(touches[t].pageX);
		valuesY.push(touches[t].pageY);
	}

	return {
		pageX: ((Math.min.apply(Math, valuesX) + Math.max.apply(Math, valuesX)) / 2),
		pageY: ((Math.min.apply(Math, valuesY) + Math.max.apply(Math, valuesY)) / 2)
	};
},

getVelocity = function(delta_time, delta_x, delta_y) {
	return {
		x: Math.abs(delta_x / delta_time) || 0,
		y: Math.abs(delta_y / delta_time) || 0
	};
},


getDistance = function(touch1, touch2) {
	var x = touch2.pageX - touch1.pageX,
		y = touch2.pageY - touch1.pageY;
	return Math.sqrt((x*x) + (y*y));
},


getAngle = function (touch1, touch2) {
	var y = touch2.pageY - touch1.pageY,
		x = touch2.pageX - touch1.pageX;
	return Math.atan2(y, x) * 180 / Math.PI;
},


getDirection = function (touch1, touch2) {
	var x = Math.abs(touch1.pageX - touch2.pageX),
		y = Math.abs(touch1.pageY - touch2.pageY);

	if(x >= y) {
		return touch1.pageX - touch2.pageX > 0 ? 'left' : 'right';
	}
	else {
		return touch1.pageY - touch2.pageY > 0 ? 'up' : 'down';
	}
},


getScale = function (start, end) {
	// need two fingers...
	if(start.length >= 2 && end.length >= 2) {
		return this.getDistance(end[0], end[1]) /
			this.getDistance(start[0], start[1]);
	}
	return 1;
},


getRotation = function (start, end) {
	// need two fingers
	if(start.length >= 2 && end.length >= 2) {
		return this.getAngle(end[1], end[0]) -
			this.getAngle(start[1], start[0]);
	}
	return 0;
};

collectEventData = function (ev) {
        var touches = ev.touches;

        return {
            center      : getCenter(touches),
            timeStamp   : new Date().getTime(),
            target      : ev.target,
            touches     : touches,
            eventType   : ev.eventType,
            srcEvent    : ev,

            /**
             * prevent the browser default actions
             * mostly used to disable scrolling of the browser
             */
            preventDefault: function() {
                if(this.srcEvent.preventManipulation) {
                    this.srcEvent.preventManipulation();
                }

                if(this.srcEvent.preventDefault) {
                    this.srcEvent.preventDefault();
                }
            },

            /**
             * stop bubbling the event up to its parents
             */
            stopPropagation: function() {
                this.srcEvent.stopPropagation();
            }
        };
},




extendEventData = function (startEv, ev) {


	// if the touches change, set the new touches over the startEvent touches
	// this because touchevents don't have all the touches on touchstart, or the
	// user must place his fingers at the EXACT same time on the screen, which is not realistic
	// but, sometimes it happens that both fingers are touching at the EXACT same time
	/*
	if(startEv && (ev.touches.length != startEv.touches.length || ev.touches === startEv.touches)) {
		// extend 1 level deep to get the touchlist with the touch objects
		startEv.touches = [];
		for(var i=0,len=ev.touches.length; i<len; i++) {
			startEv.touches.push($.extend({}, ev.touches[i]));
		}
	}

	*/

	var delta_time = ev.timeStamp - startEv.timeStamp,
		delta_x = ev.center.pageX - startEv.center.pageX,
		delta_y = ev.center.pageY - startEv.center.pageY,
		velocity = getVelocity(delta_time, delta_x, delta_y);

	return $.extend({}, ev, {
		deltaTime   : delta_time,

		deltaX      : delta_x,
		deltaY      : delta_y,

		velocityX   : velocity.x,
		velocityY   : velocity.y,

		distance    : getDistance(startEv.center, ev.center),
		angle       : getAngle(startEv.center, ev.center),
		direction   : getDirection(startEv.center, ev.center),

		//scale       : getScale(startEv.touches, ev.touches),
		//rotation    : getRotation(startEv.touches, ev.touches),

		startEvent  : startEv
	});

},


triggerEvent = function(dom, eventName, gesture, canBubble, cancelable) {
	gesture = gesture || {};
	canBubble = canBubble != null ? canBubble : false;
	cancelable = cancelable != null ? cancelable : true;
	var event = document.createEvent('Event');
	event.initEvent(eventName, canBubble, cancelable);
	event.gesture = gesture;
	dom.dispatchEvent(event);
},

install = function (el) {
	var $el = $(el);

	var lastMoveEvent = null;
	var startEvent = null;
	var touchstartCount = 0;
	var touchmoveCount = 0;



	var clear = function() {
		lastMoveEvent = null;
		startEvent = null;
		touchstartCount = 0;
		touchmoveCount = 0;



	};

	clear();


	$el.on("touchstart", function(ev) {
		touchstartCount += 1;

		ev = collectEventData(ev);

		if (touchstartCount === 1) {
			triggerEvent($el[0], "touch", ev);
		}

		if (touchmoveCount === 0) {
			startEvent = ev;
		}
	});


	$el.on("touchmove", function(ev) {

		touchmoveCount += 1;
		ev = collectEventData(ev);

		ev = extendEventData(startEvent, ev);
		lastMoveEvent = ev;

		triggerEvent($el[0], "drag", ev);
	});


	$el.on("touchend", function(ev) {
		ev = collectEventData(ev);

		if (ev.touches.length === 0) {
			triggerEvent($el[0], 'release', ev);
			clear();
		}

	});

	return {


	};

};


return {install: install};


})();


