const Discord = require('discord.js');
const tokens = require('../token.json'); //file for Discord Bot token.
const startFile = require('./start.js');
const statistics = require('./statistics.js');

var antiSpam = true;

function toggleAntispam(){
	antiSpam = !antiSpam;
}

function findBotMessages(message){
	return (startFile.client.user === message.author || message.content.startsWith(tokens.prefix));
}

function clearMessages(message, messageMagnitude){
	message.channel.fetchMessages({limit: messageMagnitude}).then(m =>{
		let filtered = m.filter(findBotMessages);
		message.channel.bulkDelete(filtered)
		.catch(err => message.channel.send(':warning: | Error while deleting messages - ' + err))
		.then(message.channel.send('Finished deleting ' + filtered.size + ' messages.'));
	});
}

function antiSpamCheck(message){
	/* Check if writer of message is:
	- A bot
	- NOT WaveBot (WaveBot has immunity against itself)
	- Message is written in servers we watch as specified in the config
	- Message is NOT WRITTEN in whitelisted channels
	- Message DOES NOT contain whitelisted words
	- antiSpam feature is currently active (as it can be disabled by user commands)
	Message removal is not executed if the checks above are failed at any point.
	*/
	const msg = message.content.toLowerCase();
	const regex = new RegExp(tokens.whitelistWords.join("|"), "im");

	return (antiSpam && message.author.bot &&
		message.author != startFile.client.user &&
		tokens.whitelistChannels.indexOf(message.channel.id)< 0 &&
		msg.match(regex) === null &&
		tokens.checkServers.indexOf(message.guild.id) > -1);
	//This should return true iff all the conditions are met.
}


module.exports = {
	antiSpamCheck: antiSpamCheck,
	toggleAntispam: toggleAntispam,
	clearMessages: clearMessages
}