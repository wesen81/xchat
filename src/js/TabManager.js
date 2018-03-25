/**
 * This class should be managed, the {@link Docler.Tab tab} objects
 * @class Docler.TabManager
 * @singleton
 */
window.Docler = window.Docler || {};
Docler.TabManager = $.extend(new Docler.Base(), {

	items: {},

	/**
	 * Add new tab to items list.
	 * @param {String} name is a tab name, it must be unique name.
	 * @param {Tab} tab is an object {@link Tab}
	 * @return this
	 */
	add: function(name, tab) {
		this.items[name] = tab;
		return this;
	},

	/**
	 * You can set new active tab. The board and the Navigation will be active.
	 * @param {String} name is defined the tab
	 * @return this
	 */
	setActiveItem: function(name) {

		this.activeTab = name;

		$.each(this.items, function(key, tab) {
			tab[ key == name ? 'show' : 'hide']();
		});

		return this;
	},

	/**
	 * You can get active tab
	 * @return {Docler.Tab|String}
	 */
	getActiveItem: function(returnName) {
		return returnName ? this.activeTab : this.items[this.activeTab];
	}
});
