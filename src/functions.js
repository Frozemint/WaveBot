const config = require('./config/config.json');
const bot = require('./bot.js');
const request = require('request');
const http = require('http');

const commandArray = ['/clear', '/ping', '/clrcom', '/help', '/say', '/sayin', '/exit', '/help', '/about', '/info', '/antispam', '/eval', '/sleep', '/vote', '/results', '/result', '/settings', '/poll', '/debug'];

const whiteListArray = config.whitelistWords;
const botOnlyServers = config.checkServers;

var antiSpam = true;

function toggleAntispam(){
	antiSpam = !antiSpam;
	return ':white_check_mark: | Antispam function has been toggled to: ' + antiSpam;
}

function findBotMessages(message){
	var responseArray = require('../src/customcommands.json');
	//set as var since custom commands can be changed on runtime.
	if (bot.client.user === message.author) {return true;}

	for (var i = 0; i < commandArray.length; i++){
		if (message.content.startsWith(commandArray[i])){ return true;}
	}

	for (var i = 0; i < Object.keys(responseArray).length; i++){
		if (message.content.substring(1) === Object.keys(responseArray)[i]) {
			message.delete();
			//I have no fucking idea why you can't just return true and
			//bulk delete. For now message.delete() on each individual messages will do the job.
			//I am out.
		}
	}

	return false;
}

function clearMessages(message){
	message.channel.fetchMessages({limit: 100}).then(function (m){
		let filtered = m.filter(findBotMessages);
		if (filtered.size >= 2){
			message.channel.sendMessage('Deleting ' + filtered.size + ' messages...').then(function(sentMessage){
				message.channel.bulkDelete(filtered).catch(function(e){
					message.channel.sendMessage('Failed to delete message: ' + e);
					return false;
				});
				sentMessage.edit(':white_check_mark: | Finished deleting ' + filtered.size + ' messages!');
			});
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
	var botOnlyChannels = config.botChannel;
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

function minecraftServerInfo (serverIP, message){
	message.channel.sendMessage('```Fetching server info...```').then (function(sentMessage){
		var url = 'https://mcapi.ca/query/' + serverIP + '/players';
		request(url, function(error, response, body){
			var data = JSON.parse(body);
			if (data.error){
				sentMessage.edit('```Error getting Minecraft server status: :' + data.error + '```');
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
