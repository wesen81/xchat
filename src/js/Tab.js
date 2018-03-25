/**
 * Tab class
 * @class Docler.Tab
 */
window.Docler = window.Docler || {};
Docler.Tab = function(options) {
	options = options || {};

	if (typeof options == 'string') {
		options = new function() {
			this.name = options;
			this.button = '[data-board='+ options +']';
			this.board = '#'+options;
		};
	}

	this.name = options.name;

	// Components
	this.elements({
		button: options.button,
		board: options.board
	});

	Docler.TabManager.add(this.name, this);

};

Docler.Tab.prototype = $.extend(new Docler.Base(), {

	// private
	active: null,

	/**
	 * You can show the board.
	 * @return {Docler.Tab}
	 */
	show: function() {
		var button = this.getButtonEl(),
		    board = this.getBoardEl();

		if (!button.hasClass('active')) {
			button.addClass('active');
		}

		if (!board.hasClass('active')) {
			board.addClass('active');
			board.trigger('activate');
		}

		this.active = true;

		this.setBlink(false);

		return this;
	},

	/**
	 * You can hide the board.
	 * @return {Docler.Tab}
	 */
	hide: function() {
		this.getButtonEl().removeClass('active');
		this.getBoardEl().removeClass('active');

		this.active = false;

		return this;
	},

	/**
	 * You can this tab activated.
	 */
	setActive: function (){
		Docler.TabManager.setActiveItem(this.name);
	},

	/**
	 * You can this tab button blinked.
	 */
	setBlink: function(bool) {
		var button = this.getButtonEl();

		if (bool === true && !this.active) {
			if (!button.hasClass('blinked')) {
				button.addClass('blinked');
			}
		}
		else {
			button.removeClass('blinked');
		}
	},

	/**
	 * You get it if the button is blinking
	 * @return {Boolean}
	 */
	isBlink: function() {
		return this.getButtonEl().hasClass('blinked');
	}
});