/**
 * This is base class
 * @class Docler.Base
 * @abstract
 */
window.Docler = window.Docler || {};
Docler.Base = function () {};

Docler.Base.prototype = {

	/**
	 * Component manager
	 * @param components
	 */
	component: function(components) {
		$.each(components, function(name, component) {
			this['get' + name[0].toUpperCase() + name.slice(1) ] = function() {
				return component;
			}
		}.bind(this));
	},

	/**
	 * Controller event manager
	 * @param {Object} controller is list of events
	 */
	control: function(controller) {
		var me = this;

		// Debug:
		// 	console.log(controller)
		//

		$.each(controller, function(selector, events) {
			$.each(events, function(name, method) {
				$(selector).on(name, function(e) {
					var params = [].slice.call(arguments),
						args = [$(this)].concat(params); // Concat other data form trigger

					me[method].apply(me, args);
				})
			});

		})

	},

	/**
	 * Elements register. It should create getter methods based on list of elements. You must define, the name and the selector.
	 *
	 *      this.elements({
	 *          button: '#chat' // output: this.getButtonEl();
	 *      });
	 *
	 *
	 * @param {Object} elements is list of elements
	 */
	elements: function(elements) {
		$.each(elements, function(name, selector) {
			this['get' + name[0].toUpperCase() + name.slice(1) + 'El' ] = function() {
				return $(selector);
			}
		}.bind(this));
	}

};