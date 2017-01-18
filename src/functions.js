const config = require('../config.json');
const bot = require('./bot.js');

const commandArray = ['/clear', '/ping', '/clrcom', '/help', '/say', '/sayin', '/exit', '/help', '/about', '/info', '/antispam', '/eval', '/sleep', '/vote', '/results', '/poll'];

const whiteListArray = config.whitelistWords;
const botOnlyChannels = config.botChannel;
const botOnlyServers = config.checkServers;
var antiSpam = true;

function toggleAntispam(){
	antiSpam = !antiSpam;
	return ':white_check_mark: | Antispam function has been toggled to: ' + antiSpam;
}

function findBotMessages(message){
	if (bot.client.user === message.author) {return true;}
	for (var i = 0; i < commandArray.length; i++){
		if (message.content.startsWith(commandArray[i])){ return true;}
	}
	return false;
}

function clearMessages(message){
	message.channel.fetchMessages({limit: 100}).then(function (m){
		filtered = m.filter(findBotMessages);
		try {
			if (filtered.size >= 2){
				message.channel.sendMessage('Deleting ' + filtered.size + ' messages...').then(function(sentMessage){
					message.channel.bulkDelete(filtered);
					sentMessage.edit('Finished deleting ' + filtered.size + ' messages!');
				});
			}
		} catch (e){
			message.channel.sendMessage('Failed to delete: ' + e);
		}
	});
}


function antiSpamFunction (bot, message){

	/* Check if writer of message is:
	- A bot
	- Message is written in servers we watch as specified in the config
	- Message is NOT WRITTEN in whitelisted channels
	- Message DOES NOT contain whitelisted words
	- Message is NOT WRITTEN by WaveBot (ourselves)
	- antiSpam feature is currently active (as it can be disabled by user commands)

	Message removal is not executed if the checks above are failed at any point.
	*/
	var tempMessage = message.content.toLowerCase();
	var regex = new RegExp(whiteListArray.join("|"), "im");
	if (antiSpam === true && message.author.bot === true && botOnlyChannels.indexOf(message.channel.id) === -1 && message.author != bot.user && tempMessage.match(regex) === null && botOnlyServers.indexOf(message.guild.id) > -1){
		console.log(Date() + ': Message \'' + message.content + '\' from ' + message.author.username +  ' will be removed.');
		return true;
	} else if (tempMessage.match(regex) != null && botOnlyChannels.indexOf(message.channel.id) === -1 && botOnlyServers.indexOf(message.guild.id) > -1 && message.author.bot === true && botOnlyServers.indexOf(message.guild.id) > -1){
		console.log(Date() + ': Message \'' + message.content + '\' is whitelisted. Not removing.');
		return false;
	} else {
		return false;
	}
}

module.exports = {
	antiSpamFunction: antiSpamFunction,
	toggleAntispam: toggleAntispam,
	clearMessages: clearMessages,
};