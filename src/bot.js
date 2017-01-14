const Discord = require('discord.js');
const command = require('./commands.js');
const bot = new Discord.Client({autoReconnect: true});
const config = require('../config.json');

const commandPrefix = config.commandPrefix;

bot.once("ready", () => {
	//This is run when the bot is ready in discord.
	//We use once to avoid many instances of the bot.
	console.log('Time is now: ' + Date());
	console.log('I am currently in ' + bot.guilds.array().length + ' server(s).');
	bot.user.setStatus("online");
	bot.user.setGame('/help to start');
});

bot.on('disconnect', function(){
	//This code is run when bot is disconnected
	console.log('------- Bot has disconnected from Discord. Time now: ' + Date());
});

bot.on('reconnecting', function(){
	//This code is run when bot is reconnecting
	console.log(Date() + ': Attempting to reconnect...');
});

bot.on('message', function(message){
	if (message.author.bot === false && message.content[0] === commandPrefix){
		message.channel.sendMessage(command.readBotCommand(message));
	}
})

module.exports = bot;


