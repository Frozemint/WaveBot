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
		commandText = message.content.split(" ");
		commandText[0] = commandText[0].substring(1, commandText[0].length);
		messagesCount++;

		switch(commandText[0].toLowerCase()){
				case "ping":
					return '*waves back*';
					break;
				default:
					return 'Command not found. Try running /help.';
					break;
		}
	}
}