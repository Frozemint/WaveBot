var configFile = require('../config/config.json');
const startFile = require('./bot.js');

function checkMessageForRemoval(msg){
	if (!msg.author.bot || message.author === startFile.client.user){
		return false;
	}
	if (configFile)
}

module.exports = {
	checkMessageForRemoval: checkMessageForRemoval
}