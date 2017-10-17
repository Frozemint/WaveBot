
const tokens = require('../token.json');
var messageCount = removedMessage = commandCount = totalBotMessage = 0;

function trackMessage(message){
	messageCount++;
	if (message.author.bot){
		totalBotMessage++;
	}
	if (!message.author && message.content[0] === tokens.prefix){
		commandCount++;
	}
}

function increaseRemovedCount(){ removedMessage++; }

function printStatistics(message){

}

module.exports = {
	trackMessage: trackMessage,
	increaseRemovedCount: increaseRemovedCount
}