/**
* This is the settings board view.
* @class Docler.SettingsBoard
*/
window.Docler = window.Docler || {};

Docler.SettingsBoard = function(options) {
	Docler.Tab.apply(this, arguments);

	var me = this,
		prefix = '#' + this.name,
		panel = prefix + ' .panel',
		header = prefix + ' .panel-header',
		sliderWidth = prefix + ' [data-slider=width]',
		sliderHeight = prefix + ' [data-slider=height]';

	// Components
	this.component({
		sliderWidth: new Docler.Slider({
			target: sliderWidth,
			label: 'Width',
			defaultValue: 800
		}),

		sliderHeight: new Docler.Slider({
			target: sliderHeight,
			label: 'Height',
			defaultValue: 600
		})

	});

	// Elements
	this.elements({
		panel: panel,
		header: header
	});

	// Listeners
	this.control(new function() {
		this[prefix] = {
			activate: 'onActive'
		};

		this[header] = {
			click: 'onToggleAccordion'
		};

		this[prefix + ' [data-slider]'] = {
			sliderchange: 'onChangeSlider'
		};
	});

};

Docler.SettingsBoard.prototype = $.extend(new Docler.Tab(), {

	/**
	 * When the board is active
	 */
	onActive: function () {
		var width  = this.getSliderWidth(),
			height = this.getSliderHeight();

		if (width.position < 0) {
			width.resetPosition();
		}

		if (height.position < 0) {
			height.resetPosition();
		}

	},

	/**
	 * When user clicks the panel header on setting board.
	 * @param {jQuery} scope
	 * @param {Event} e
	 */
	onToggleAccordion: function(scope, e) {
		scope.closest('.panel')
			 .toggleClass('collapse');
	},

	/**
	 * When user changes the resoulution of the images.
	 * @param {jQuery} scope
	 * @param {Event} e
	 * @param {Number} value as new width or height value
	 */
	onChangeSlider: function(scope, e, value) {
		var me     = this,
			width  = me.getSliderWidth().record,
			height = me.getSliderHeight().record,
			board  = $('#carousel'),
			type   = scope.data('slider'),
			event  = 'imagesizechange';

		switch(type) {
			case 'width':
				board.trigger(event, [value, height]);
				break;
			case 'height':
				board.trigger(event, [width, value]);
				break;
			default:
		}
	}
});

