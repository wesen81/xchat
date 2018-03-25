/**
 * Docler Application
 * @class Docler.App
 */
window.Docler = window.Docler || {};
Docler.App= function() {

	// Components
	this.component({
		chat: new Docler.ChatBoard('chat', true),
		carousel: new Docler.CarouselBoard('carousel'),
		settings: new Docler.SettingsBoard('settings')
	});

	// Events
	this.control({
		".nav-button": {
			"click": "onTabButtonClick"
		}
	});

	window.App = this;
};

Docler.App.prototype = $.extend(new Docler.Base(), {

	/**
	 * You can change tab.
	 * @param {String} name as tab name
	 */
	setTab: function(name) {
		Docler.TabManager.setActiveItem(name);
	},

	// Events callback

	/**
	 * If user clicks the navigation button.
	 * @param {jQuery} scope
	 * @param {Event} event
	 */
	onTabButtonClick: function(scope, event) {
		var name = scope.data('board');
		this.setTab(name || 'chat');
	}

});