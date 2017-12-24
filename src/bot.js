const Discord = require('discord.js');
const client = new Discord.Client({autoReconnect: true});
var configFile = require('../config/config.json');
var commands = require('./commands.js');
commands = commands.commands;

client.on('ready', () =>{
	console.log('Bot ready.');
})

client.on('message', msg =>{
	if (!msg.content.startsWith(configFile.commandPrefix)) return;
	if (commands.hasOwnProperty(msg.content.toLowerCase().slice(configFile.commandPrefix.length).split(' ')[0])) commands[msg.content.toLowerCase().slice(configFile.commandPrefix.length).split(' ')[0]](msg);
})

client.login(configFile.botToken);