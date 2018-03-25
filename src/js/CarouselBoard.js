/**
 * This is the carousel board view.
 * @class Docler.CarouselBoard
 */
window.Docler = window.Docler || {};

Docler.CarouselBoard = function(options) {
	Docler.Tab.apply(this, arguments);

	var me            = this,
		prefix        = '#' + this.name,
		carouselBody  = prefix + ' .carousel-body',
		carouselLeft  = prefix + ' .carousel-control.left',
		carouselRight = prefix + ' .carousel-control.right',
		carouselItems = prefix + ' .carousel-item',
		carouselImgs  = prefix + ' .carousel-item img',
		loader        = prefix + ' .carousel-loader';

	// Component
	this.component({
		swipe: new Docler.SwipeEvent(carouselBody)
	});

	// Elements
	this.elements({
		carouselBody: carouselBody,
		carouselLeft: carouselLeft,
		carouselRight: carouselRight,
		carouselItems: carouselItems,
		carouselImgs: carouselImgs,
		loader: loader
	});

	// Listeners
	this.control(new function() {
		this[carouselLeft] = {
			click: 'prevItem'
		};

		this[carouselRight] = {
			click: 'nextItem'
		};

		this[carouselBody] = {
			swipeleft: 'prevItem',
			swiperight: 'nextItem'
		};

		this[prefix] = {
			imagesizechange: 'onChangeImageSize'
		}
	});

	this.activeItem = this.generateNewImage();


};

Docler.CarouselBoard.prototype = $.extend(new Docler.Tab(), {

	/**
	 * Counter
	 * @private
	 */
	seed: 0,

	/**
	 * Show active item
	 * @private
	 */
	activeItem: null,

	/**
	 * @const {String} URL
	 */
	URL: "https://picsum.photos/{width}/{height}?random&v={ts}",

	baseImageWidth: null,
	baseImageHeight: null,

	/**
	 * You can get url with timestamp.
	 * @return {string}
	 */
	getUrl: function() {
		var size = this.getImageSize(),
			ts   = new Date().valueOf();

			return this.URL
					  .replace('{width}', size.width)
					  .replace('{height}', size.height)
					  .replace('{ts}', ts);

	},

	/**
	 * You can get image size.
 	 * @return {{width: *, height: *}}
	 */
	getImageSize: function() {
		var me = this,
			wType = typeof this.baseImageWidth,
			hType = typeof this.baseImageHeight;

		return {
			width: wType === 'number' && this.baseImageWidth > 0 ? this.baseImageWidth : 800,
			height: hType === 'number' && this.baseImageHeight > 0 ? this.baseImageHeight : 600
		}


	},

	/**
	 * Generate new item, if isn't exists
	 * @param {String} before, it is `true` if you will insert before the first position.
	 * @return {jQuery|HTMLElement}
	 */
	generateNewImage: function(before) {
		var me    = this,
			body  = this.getCarouselBodyEl(),
			item  = $('<div>'),
			img   = $('<img src="">'),
			index = this.seed++;

		item.addClass('carousel-item');

		// Debug:
		//  console.log(index, before ? 'prepend' : 'append')
		//

		if (index === 0) {
			item.addClass('active');
		}

		img.attr(
			'src', this.getUrl()
		);

		img.attr('alt', 'Generated image: ID-' + index);

		// Image loader process

		this.setLoader(true);

		img
			.one("load", function () {
				me.setLoader(false);
			})
			.each(function () {
				if (this.complete) $(this).load();
			});

		item.append(img);
		body[before ? 'prepend' : 'append'](item);

		return item;
	},

	/**
	 * You can show image loader
	 * @param show
	 */
	setLoader: function(show) {
		var loader = this.getLoaderEl();

		if (show) loader.removeClass('hide');
		else if (!loader.hasClass('hide')) {
			loader.addClass('hide')
		}
	},

	/**
	 * You can go to next item. Application generates new one, if it does'nt exists
	 */
	nextItem: function() {
		var active = this.activeItem,
			next = active.next(),
		    exist = this.isExist(next),
		    item;

		item = !exist ? this.generateNewImage() : next;

		active.removeClass('active')
		      .next()
		      .addClass('active');

		this.activeItem = item;
	},

	/**
	 * You can go to previous item. Application generates new one, if it does'nt exist
	 */
	prevItem: function() {
		var active = this.activeItem,
		    prev = active.prev(),
		    exist = this.isExist(prev),
		    item;

		item = !exist ? this.generateNewImage('before') : prev;

		active.removeClass('active')
		      .prev()
		      .addClass('active');

		this.activeItem = item;
	},

	onChangeImageSize: function(scope, e, width, height) {
		this.setImageSize(width, height);
	},

	/**
	 * You can set the images size.
	 * @param width
	 * @param height
	 */
	setImageSize: function(width, height) {
		var imgs = this.getCarouselImgsEl();

		imgs.width(width || 'auto');
		imgs.height(height || 'auto');

		this.baseImageWidth = imgs.width();
		this.baseImageHeight = imgs.height();
	},

	/**
	 * Item checking
	 * @param {jQuery} item
	 * @return {boolean}
	 */
	isExist: function(item) {
		return !!item.get(0) ;
	}
});

