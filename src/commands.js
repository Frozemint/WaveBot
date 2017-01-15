const bot = require('./bot.js');
const botFunctions = require('./functions.js');

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

function increaseMessageCounter(){
	removedMessages++;
}

function readBotCommand(client, message){
		commandText = message.content.split(" ");
		commandText[0] = commandText[0].substring(1, commandText[0].length);
		messagesCount++;

		switch(commandText[0].toLowerCase()){
				case "ping":
					return '*waves back*';
				case "say":
					if (!commandText[1]){ return ':warning: | You need to tell me what to say.';}
					return message.content.substring(commandText[0].length+1);
				case "sayin":
					stringToAnnounce = message.content.substring(commandText[0].length + commandText[1].length + 2);
					stringToAnnounce = stringToAnnounce.replace('\\', '');
					setTimeout(function(){ message.channel.sendMessage(stringToAnnounce)}, 1000 * 60 * commandText[1]);
					return ' :timer: | You are set! Message will be broadcasted after ' + commandText[1] + ' minutes.';
				case "exit":
					client.destroy().then(function() { process.exit(0);});
				case "help":
					message.author.sendMessage('**Command List for WaveBot**\n'+
					`\`\`\`/ping - Pings WaveBot. Useful for checking on Bot.
/say <content> - Makes WaveBot type <content> into the text channel the command was ran
/about - Prints information about WaveBot
/info - Prints statistics about WaveBot
/vote <option> - Vote for <option> when a poll is active
/results - Used to view results of a poll when a poll is active
\n\n----- Admin Commands -----\n\n
/sayin <content> <delay in minutes> - WaveBot will announce <content> after <delay in minutes> in the channel the command was ran
/clrcom - Clear all command massages related to WaveBot from users in the channel this command was ran
/clear - Clear all WaveBot output from the channel this command was ran
/antispam - Toggle the automated removal of bot messages from unwanted channels
/poll <question/options/default/start/end> [options...] - Used to host a poll
/eval <javascript code> - Used to run arbitary Javascript Code. USE WITH CAUTION!
/exit - Exits WaveBot\`\`\``);
				case "info":
					return `Information on WaveBot:\n` + `\`\`\`Logged in as     : ${client.user.username}
Discord uptime   : ${Math.floor(client.uptime / (1000 * 60 * 60 * 24))} days ${Math.floor(client.uptime / (1000 * 60 * 60))} hours ${Math.floor(client.uptime / (1000 * 60))% 60} minutes ${Math.floor(client.uptime / 1000) % 60} seconds
Process uptime   : ${Math.floor(process.uptime() / (60 * 60 * 24))} days ${Math.floor(process.uptime() / (60 * 60))} hours ${Math.floor(process.uptime() / 60)% 60} minutes ${Math.floor(process.uptime() % 60)} seconds
Messages tracked : ${messagesCount}
Removed messages : ${removedMessages}
Commands ran     : ${commandCount}\`\`\``;
				
				default:
					return 'Command not found. Try running /help.';
					break;
		}
}

module.exports = {
	readBotCommand: readBotCommand,
	increaseMessageCounter: increaseMessageCounter
}