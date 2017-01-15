const config = require('../config.json');

const commandArray = ['/clear', '/ping', '/clrcom', '/help', '/say', '/sayin', '/exit', '/help', '/about', '/info', '/antispam', '/eval', '/sleep', '/vote', '/results', '/poll'];

const whiteListArray = config.whitelistWords;
const botOnlyChannels = config.botChannel;
const botOnlyServers = config.checkServers;

function checkPermissions (message){
	if (message.member.roles.find('name', 'Bot Commander') || message.author.id === '114721723894595589' || message.member.hasPermission('ADMINISTRATOR')) {
		//Check if use has role "Bot Commander" tagged or if writer of bot is trying ot run command.
		console.log(Date() + ': User ' + message.author.username + ' is admin, running command.');
		return true;
	} else {
		//Log the incident if it's not an authorised user.
		console.log('User ' + message.author.username + ' just attempted to run a admin only command and was denied.');
		message.channel.sendMessage(':no_entry_sign: | You do not have permission to execute the said command, this incident will be reported.');
		return false;
	}
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
	tempMessage = message.content.toLowerCase();
	regex = new RegExp(whiteListArray.join("|"), "im");
	if (message.author.bot === true && botOnlyChannels.indexOf(message.channel.id) === -1 && message.author != bot.user && tempMessage.match(regex) === null && botOnlyServers.indexOf(message.guild.id) > -1){
		console.log(Date() + ': Message \'' + message.content + '\' from ' + message.author.username +  ' will be removed.');
		return true;
	} else if (tempMessage.match(regex) != null && botOnlyChannels.indexOf(message.channel.id) === -1 && botOnlyServers.indexOf(message.guild.id) > -1 && message.author.bot === true && botOnlyServers.indexOf(message.guild.id) > -1){
		console.log(Date() + ': Message \'' + message.content + '\' is whitelisted. Not removing.');
		return false;
	} else {
		return false;
	}
}

function findUserVote (user){
	for (let i = 0; i < voters.length; i++){
		let value = voters[i].split('|');
		if (value[1].indexOf(user) > -1){
			return true;
		}
	}
	return false;
}

function countUserVote (option){
	let totalVoters = 0;
	for (let i = 0; i < voters.length; i++){
		let value = voters[i].split('|');
		if (value[0].indexOf(option) > -1){
			totalVoters++;
		}
	}
	return totalVoters;
}

function countVoteIdentity (user){
	let votersIdentity = [];
	for (let i = 0; i < voters.length; i++){
		let value = voters[i].split('|');
		if (value.indexOf(user) > -1){
			votersIdentity.push(value[2]);
		}
	}
	return votersIdentity.join(', ');
}

module.exports = {
	checkPermissions: checkPermissions,
	antiSpamFunction: antiSpamFunction,
	findUserVote: findUserVote,
	countUserVote: countUserVote,
	countVoteIdentity: countVoteIdentity
};