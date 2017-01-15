const Discord = require('discord.js');
const command = require('./commands.js');
const botFunction = require('./functions.js');
const client = new Discord.Client({autoReconnect: true});
const config = require('../config.json');

const commandPrefix = config.commandPrefix;

client.once("ready", () => {
	//This is run when the bot is ready in discord.
	//We use once to avoid many instances of the bot.
	console.log('Time is now: ' + Date());
	console.log('I am currently in ' + client.guilds.array().length + ' server(s).');
	client.user.setStatus("online");
	client.user.setGame('/help to start');
});

client.on('disconnect', function(){
	//This code is run when bot is disconnected
	console.log('------- Bot has disconnected from Discord. Time now: ' + Date());
});

client.on('reconnecting', function(){
	//This code is run when bot is reconnecting
	console.log(Date() + ': Attempting to reconnect...');
});

client.on('message', function(message){
	if (message.channel instanceof Discord.DMChannel) { return; } //Do not respond to DM.

	if (botFunction.antiSpamFunction(client, message) === true){
		message.delete();
		command.increaseMessageCounter();
	}

	if (message.author.bot === false && message.content[0] === commandPrefix){
		//
		output = command.readBotCommand(client, message);
		if (output) { message.channel.sendMessage(output);}
	}
})

module.exports = client;


