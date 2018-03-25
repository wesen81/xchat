/**
 * Communication class, it uses the socket.io client
 * @class Docler.Socket
 */
window.Docler = window.Docler || {};
Docler.Socket = function (options) {

	options = options || {};

	/**
	 * @const {String} URL
	 * Url of SOCKET.io
	 */
	this.URL = options.url || "http://185.13.90.140:8081";

	/**
	 * @const {String} USER_CONNECTION
	 * If user connected to the chat
	 */
	this.USER_CONNECTION = "User connection";

	/**
	 * @const {String} USER_DISCONNECTION
	 * If user disconnected from the chat
	 */
	this.USER_DISCONNECTION = "User disconnection";

	/**
	 * @const {Boolean} DEBUG
	 * If it's true, debug mode is active
	 */
	this.DEBUG = !!options.debug;

	this.onConnect = options.onConnect || function() {};
	this.onDisconnect = options.onDisconnect || function() {};
	this.onMessage = options.onMessage || function() {};
	if (options.autoStart) this.start();

	//if (this.DEBUG) window.Session = this;

};

Docler.Socket.prototype = $.extend(new Docler.Base(), {
	/**
	 * Start chat application;
	 */
	start: function() {
		var me        = this,
		    socket    = io.connect(me.URL);

		// websocket
		me.SOCKET = socket;

		// if user connected to the chat
		socket.on('connect', function (data) {
			console.log(me.USER_CONNECTION);
			me.onConnect(data);
		});

		socket.on("disconnect", function(data) {
			console.log(me.USER_DISCONNECTION);
			me.onDisconnect(data);
		});

		socket.on("message", function(data) {

			var align, user, message, guest;

			if (data && data.user) {

				user    = data.user;
				message = data.message;

				if ("chatBot2000" === user) {
					align = "text-left";
				}
				else if ("echoBot2000" === user) {
					align = "text-right";
					guest = message.match(/^(\w+).*/)[1];
					message = message.replace(/.*:./, "");
				}

				console.log("LOG", guest || user, message, align, data)

				me.onMessage(guest || user, message, align, data);
			}
		});

	},

	/**
	 * Fetching message
	 * @param {String} user as user's nickname
	 * @param {String} msg as text content
	 */
	fetch: function(user, msg) {
		if (user && msg) {
			this.SOCKET
			    .emit('message',  { message: msg , user: user });
		}
		else {
			console.log("ERROR: Write username and message!");

			// If you want this:
			//
			// this.addLine(
			// 	"Missing username or message!",
			// 	"center",
			// 	true
			// )
		}
	}
});