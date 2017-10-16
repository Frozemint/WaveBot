const config = require('./config/config.json');
const bot = require('./bot.js');
const request = require('request');
const http = require('http');

const whiteListArray = config.whitelistWords;
const botOnlyServers = config.checkServers;

var antiSpam = true;
var messagesCount = removedMessages = commandCount = totalBotMessages = 0;

//=============================
//File made of helper functions for bot functionality
//such as message deleting and statistics tracking


function toggleAntispam(){
	antiSpam = !antiSpam;
	return ':white_check_mark: | Antispam function has been toggled to: ' + antiSpam;
}

function statisticsTracking(message){
	messagesCount++;
	if (message.author.bot){
		totalBotMessages++;
	}
	if (message.content[0] == config.commandPrefix){
		commandCount++;
	}
}


function findBotMessages(message){
	if (bot.client.user === message.author) {return true;}
	if (message.content.startsWith(config.commandPrefix)){ return true;}

	return false;
}

function clearMessages(message, messageMagnitude){
	message.channel.fetchMessages({limit: messageMagnitude}).then(m =>{
		let filtered = m.filter(findBotMessages);
		message.channel.bulkDelete(filtered)
		.catch(err => message.channel.send(':warning: | Error while deleting messages - ' + err))
		.then(message.channel.send('Finished deleting ' + filtered.size + ' messages.'));
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
	var botOnlyChannels = config.botChannel;
	var tempMessage = message.content.toLowerCase();
	var regex = new RegExp(whiteListArray.join("|"), "im");
	if (antiSpam === true && message.author.bot === true && botOnlyChannels.indexOf(message.channel.id) === -1 && message.author != bot.user && tempMessage.match(regex) === null && botOnlyServers.indexOf(message.guild.id) > -1){
		console.log(Date() + ': Message \'' + message.content + '\' from ' + message.author.username +  ' will be removed.');
		removedMessages++
		return true;
	} else if (tempMessage.match(regex) != null && botOnlyChannels.indexOf(message.channel.id) === -1 && botOnlyServers.indexOf(message.guild.id) > -1 && message.author.bot === true && botOnlyServers.indexOf(message.guild.id) > -1){
		console.log(Date() + ': Message \'' + message.content + '\' is whitelisted. Not removing.');
		return false;
	} else {
		return false;
	}
}

function minecraftServerInfo (serverIP, message){
	message.channel.send('```Fetching server info...```').then(function(sentMessage){
		var url = 'https://mcapi.ca/query/' + serverIP + '/players';
		request(url, function(error, response, body){
			var data = JSON.parse(body);
			if (data.error){
				sentMessage.edit('```Error getting Minecraft server status: ' + data.error + '\n Try using the server\'s IP instead of domain name.```');
				return;
			}
			var minecraftData = '```';
			if(!data.status){
				minecraftData += 'The server appears to be offline.```';
				sentMessage.edit(minecraftData);
				return;
			}
			//If we reach this point, the server is online.
			minecraftData += `The server ` + serverIP + ` is online!
Server Ping   : ` + data.ping + `ms
Online Players: ` + data.players.online + `
Max Players   : ` + data.players.max;
			minecraftData += '```';
			sentMessage.edit(minecraftData);
		})
	});
}

module.exports = {
	antiSpamFunction: antiSpamFunction,
	toggleAntispam: toggleAntispam,
	clearMessages: clearMessages,
	minecraftServerInfo: minecraftServerInfo
};
