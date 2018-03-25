/**
 * This is the chat board view.
 * @class Docler.ChatBoard
 */
window.Docler = window.Docler || {};
Docler.ChatBoard = function(options, showUserName) {

	Docler.Tab.apply(this, arguments);

	var me = this,
		prefix = '#' + this.name;

	// Components
	this.component({
		socket: new Docler.Socket({
			autoStart: true,
			onMessage: me.onArrivalMessage.bind(me)
		})
	});

	// Elements
	this.elements({
		area:  prefix + ' .chat-area',
		send: prefix + ' .chat-button',
		message: prefix + ' .chat-message',
		user: '[name=username]'
	});

	// Listeners
	this.control(new function() {
		this[prefix + ' .chat-button'] = {
			click: 'onSendMessage'
		};
		this[prefix + ' .chat-message'] = {
			keydown: 'onKeyDown'
		};
	});

	this.showUserName = showUserName || options.showUserName;

	this.active = this.getBoardEl().hasClass('active');



};

Docler.ChatBoard.prototype = $.extend(new Docler.Tab(), {

	/**
	 * Add new line to content
	 * @param {String} owner as sender
	 * @param {String} text as message text
	 * @param align {String}
	 * @param isError
	 */
	addNewLine: function(owner, text, align, isError) {
		var area = this.getAreaEl(),
		    line = $('<div>'),
			sender = $('<span>');

		line.addClass(['msg', align]);
		if (isError) line.addClass("error");

		if (this.showUserName === true) {
			sender.addClass('sender');
			sender.append(owner + ": ");
		}

		line.append(sender);
		line.append(text || "...");

		area.append(line);

		// Scroll bottom position
		this.toScrollBotton();
	},

	/**
	 * When add new line, it is scrolling down
	 */
	toScrollBotton: function() {
		var area = this.getAreaEl(),
		    height = area.get(0).scrollHeight;

		area.animate({scrollTop: height}, 500);
	},

	// Events callback

	/**
	 * If user sends a message
	 */
	onSendMessage: function() {
		var me = this,
			socket = this.getSocket(),
			message = this.getMessageEl().val();

		socket.fetch(
			me.getUserName(),
			message
		);

		// After user sent the message, messagebox will clear;
		this.getMessageEl().val('');
	},

	/**
	 * If a message arrivals
	 */
	onArrivalMessage: function(owner, message, align, data) {
		this.addNewLine(owner, message, align);
		this.setBlink(true);
	},

	/**
	 * If user press ENTER in the message box.
	 */
	onKeyDown: function(scope, e) {
			var key = e.which || e.keyCode;
			if (key === 13) { // 13 is enter
				this.onSendMessage.apply(this)
			}
	},

	/**
	 * You can to get username.
	 * @return {string}
	 */
	getUserName: function() {
		var user = this.getUserEl().val();
		return user || 'Unknow user name';
	}

});
