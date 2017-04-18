const Discord = require('discord.js');
const command = require('./commands.js');
const botFunction = require('./functions.js');
const client = new Discord.Client({autoReconnect: true});
const config = require('../config.json');

var commandPrefix = config.commandPrefix;

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

client.on('warn', function(info){
	//Emitted by discord.js on general discord error
	console.log(Date() + ': Discord.js encountered an error - ' + info);
});

client.on('error', function(error){
	//Emitted by discord.js on a connection error
	console.log(Date() + ': Discord.js encountered a connection error - ' + error);
});


client.on('message', function(message){

	if (message.channel instanceof Discord.DMChannel) { message.author.sendMessage('I cannot run commands in Direct Messages. Sorry :('); return; } //Do not respond to DM.
	command.increaseMessageCounter();

	if (message.author.bot === true) { command.increaseBotMessageCounter();}

	if (botFunction.antiSpamFunction(client, message) === true){
		message.delete();
		command.increaseRemovedCounter();
	}

	if (message.author.bot === false && message.content[0] === commandPrefix){
		command.increaseCommandCounter();
		output = command.readBotCommand(client, message, message.user);
		if (output) { message.channel.sendMessage('<@' + message.author.id + '> | ' + output);}
	}
})

exports.client = client;
