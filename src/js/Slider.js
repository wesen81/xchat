/**
 * Slider
 * @class Docler.Slider
 */
window.Docler = window.Docler || {};
Docler.Slider = function(options) {

	options = options || {};

	this.target = options.target;
	this.cls = options.cls;
	this.label = options.label;
	this.defaultValue = options.defaultValue || 0;

	this.init(options);
	this.initEvent();

	this.resetPosition();
};

Docler.Slider.prototype = $.extend(new Docler.Base(), {

	// private
	seed: 0,

	// private
	ismove: false,

	// private
	record: 0,

	// private
	position: null,

	// private
	maxRecord: 2000,

	/**
	 * @cfg {Number} defaultValue
	 */
	defaultValue: 0,

	/**
	 * @const {String} TRACER
	 */
	TRACER: 'tracer',

	/**
	 * @const {String} BUTTON
	 */
	BUTTON: 'tracer-button',

	/**
	 * @const {String} BUTTON
	 */
	TOOLTIP: 'tooltip',

	/**
	 * @const {String} LABEL
	 */
	LABEL: 'label',

	/**
	 * @const {String} TEXTFIELD
	 */
	TEXTFIELD: 'textfield',

	/**
	 * @const {String} PREFIX
	 */
	PREFIX: '#{id} .{class}',

	/**
	 * Initializes the slider.
	 * @param {Object} options as a config
	 */
	init: function(options) {
		var me     = this,
			target = $(me.target),
			name   = target.data('slider'),
			id     = 'slider-' + name + '-' + me.seed++,
			prefix = me.PREFIX.replace('{id}', id),
			tracer, button, tooltip, label, textfield, px;

		// Init target element
		if (!target.hasClass('slider')) target.addClass('slider');

		target.addClass(me.cls)
			  .attr('id', id)
			  .data('slider', name);

		// Init tracer element
		tracer = $('<div>').addClass(me.TRACER);

		// Init button
		button = $('<div>').addClass(me.BUTTON);

		// Init tooltip
		tooltip = $('<div>').addClass(me.TOOLTIP);

		// Init label
		label = $('<div>').addClass(me.LABEL)
						  .append(me.label)
						  .append('<br>')
						  .append('(px)');

		// Init textfield
		textfield = $('<input type="text" readonly>').addClass(me.TEXTFIELD)
													 .attr('name', name)
													 .data('slider', name);

		px = $('<div>').append(' px');

		target.append(
			tracer.append(button)
		);

		target.append(
			tooltip.append(label)
				   .append(textfield)
		);

		me.elements(new function() {
			this.target = '#' + id;
			this.tracer = prefix.replace('{class}', me.TRACER);
			this.button = prefix.replace('{class}', me.BUTTON);
			this.text   = prefix.replace('{class}', me.TEXTFIELD);
		});
	},

	/**
	 * Initializes the slider events.
	 */
	initEvent: function() {
		var me     = this,
			target = me.getTargetEl(),
			tracer = me.getTracerEl(),
			button = me.getButtonEl();

			function onmove(e) {
				if (me.ismove) {

					var min = 0,
						max = tracer.outerWidth() - button.outerWidth(),
						event = e.changedTouches ? e.changedTouches[0] : e,
						mousePos = (event.pageX - tracer.offset().left - (button.outerWidth() / 2)),
						position = (mousePos > max ? max : mousePos < min ? min : mousePos),
						record = Math.floor((position / max) * me.maxRecord);

					me.setPositionByPixel(record);
				}
			}

		if (!me.eventReady) {
			tracer.on('mousedown touchstart', function(e) {

				me.ismove = true;
				onmove.apply(me, arguments);
			});

			$(window).on('mouseup touchend', function(e) {
				me.ismove = false;
			});

			$(window).on( 'mousemove touchmove', function(e) {
				onmove.apply(me, arguments);
			});

			me.eventReady = true;
		}
	},

	/**
	 * You can set the resolution of images
	 * @param {Number} pixel
	 */
	setPositionByPixel: function(pixel) {

		pixel = pixel > this.maxRecord ? this.maxRecord : pixel;

		var me       = this,
			target   = me.getTargetEl(),
			button   = me.getButtonEl(),
			tracer   = me.getTracerEl(),
			text     = me.getTextEl(),
			max      = tracer.outerWidth() - button.outerWidth(),
			position = Math.floor((pixel / me.maxRecord) * max);

		button.css('margin-left', position + 'px');
		text.val(pixel);

		me.record = pixel;
		me.position = position;

		target.trigger('sliderchange', [pixel]);
	},

	/**
	 * Reset slider position.
	 */
	resetPosition: function() {
		this.setPositionByPixel(this.defaultValue);
	}
});