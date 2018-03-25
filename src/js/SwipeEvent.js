/**
 * Swipe Event
 * @class Doclet.SwipeEvent
 */
window.Docler = window.Docler || {};
Docler.SwipeEvent = function(target) {

	var touchStartCoords =  {'x':-1, 'y':-1}, // X and Y coordinates on mousedown or touchstart events.
	    touchEndCoords = {'x':-1, 'y':-1},// X and Y coordinates on mouseup or touchend events.
	    direction = 'undefined',// Swipe direction
	    minDistanceXAxis = 30,// Min distance on mousemove or touchmove on the X axis
	    maxDistanceYAxis = 500,// Max distance on mousemove or touchmove on the Y axis
	    maxAllowedTime = 3000,// Max allowed time between swipeStart and swipeEnd
	    startTime = 0,// Time on swipeStart
	    elapsedTime = 0;// Elapsed time between swipeStart and swipeEnd

	target = $(target);

	target.on('mousedown touchstart', function(e) {
		e = e ? e : window.event;
		e = (e.changedTouches) ? e.changedTouches[0] : e;
		touchStartCoords = {'x':e.pageX, 'y':e.pageY};
		startTime = new Date().getTime();
		target.trigger('swipestart');
	});

	target.on('mousemove touchmove', function(e){
		e = e ? e : window.event;
		e.preventDefault();
		target.trigger('swipemove');
	});

	target.on('mouseup touchend', function swipeEnd(e) {
		e = e ? e : window.event;
		e = (e.changedTouches) ? e.changedTouches[0] : e;
		touchEndCoords = {'x':e.pageX - touchStartCoords.x, 'y':e.pageY - touchStartCoords.y};
		elapsedTime = new Date().getTime() - startTime;
		target.trigger('swipeend');

		if (elapsedTime <= maxAllowedTime){
			if (Math.abs(touchEndCoords.x) >= minDistanceXAxis && Math.abs(touchEndCoords.y) <= maxDistanceYAxis){
				direction = (touchEndCoords.x < 0)? 'left' : 'right';

				switch(direction){
					case 'left':
						target.trigger('swipeleft');
						break;
					case 'right':
						target.trigger('swiperight');
						break;
				}
			}
		}
	});

};

