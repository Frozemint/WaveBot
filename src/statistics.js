
const startFile = require('./start.js');
const tokens = require('../token.json');
var messageCount = removedMessage = commandCount = totalBotMessage = 0;

function trackMessage(message){
	messageCount++;
	if (message.author.bot){
		totalBotMessage++;
	}
	if (!message.author.bot && message.content[0] === tokens.prefix){
		commandCount++;
	}
}

function increaseRemovedCount(){ removedMessage++; }

function printStatistics(){
	return (" :information_source: | Statistics on WaveBot:\n" + "```" +
		`Logged in as       : ${startFile.client.user.username}\n` + 
		`Process Uptime     : ${Math.floor(process.uptime() / (60 * 60 * 24))} days ${Math.floor(process.uptime() / (60 * 60) % 24)} hours ${Math.floor(process.uptime() / 60)% 60} minutes ${Math.floor(process.uptime() % 60)} seconds\n` +
		`Discord Uptime     : ${Math.floor(startFile.client.uptime / (1000 * 60 * 60 * 24))} days ${Math.floor(startFile.client.uptime / (1000 * 60 * 60)) % 24} hours ${Math.floor(startFile.client.uptime / (1000 * 60))% 60} minutes ${Math.floor(startFile.client.uptime / 1000) % 60} seconds\n` +
		`Message Tracked    : ${messageCount}\n`+
		`Removed Messages   : ${removedMessage}\n` +
		`Total Bot Message  : ${totalBotMessage}\n` +
		`Commands Ran:      : ${commandCount}\`\`\``);
}

module.exports = {
	trackMessage: trackMessage,
	increaseRemovedCount: increaseRemovedCount,
	printStatistics: printStatistics
}