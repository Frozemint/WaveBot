const bot = require('./bot.js');

//Counters for stats
var messagesCount = 0;
var removedMessages = 0;
var commandCount = 0;

/* Variables for conducting polls */
var universalSuffrage = false;
var pollChannelID = '';
var pollQuestion = "";
var votersArray = [];
var optionArray = [];

module.exports = {
	readBotCommand: function(message){
		messagesCount++;

		if (message.content === 'ping'){
			return 'pong';
		}
	}
}