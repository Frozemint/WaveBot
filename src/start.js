const Discord = require('discord.js');
const tokens = require('../token.json'); //file for Discord Bot token.
const botCommands = require('./botCommands.js');
const client = new Discord.Client({autoReconnect: true});

client.once('ready', () => {
	console.log('Time is now: ' + Date());
	console.log('I am currently in ' + client.guilds.array().length + ' server(s).');
	
	client.user.setStatus("online");
	client.user.setGame('/help to start');
})

client.on('message', function(message){
	botCommands.readCommand(message, client);
})

client.login(tokens.botToken);