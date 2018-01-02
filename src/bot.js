const Discord = require('discord.js');
const client = new Discord.Client({autoReconnect: true});
var configFile = require('../config/config.json');
var commands = require('./commands.js');
commands = commands.commands;

process.title = 'wavebot';
process.on('exit', (code) => { console.log('Bot exiting ' + ((code > 0) ? 'with error' : 'normally') + ' at time: ' + Date()); });
process.on('SIGINT', () => { console.log('Caught ^C, exiting at time: ' + Date()); });
process.on('uncaughtException', (err) => { 
	console.log('UNCAUGHT EXCEPTION at time ' + Date() + '\n' + ((err && err.stack) ? err.stack : err) + '\n');
	process.exit(1);
 });

client.on('ready', () =>{
	consodle.log('Bot now online. Time is ' + Date());
})

client.on('message', msg =>{
	if (1 == 1 && !msg.author.bot) msg.react('🎉');  //festive boi
	if (!msg.content.startsWith(configFile.commandPrefix) || msg.author.bot) return;
	if (commands.hasOwnProperty(msg.content.toLowerCase().slice(configFile.commandPrefix.length).split(' ')[0])) {
		console.log(Date() + '| Running command "' + msg.content + '" sent by ' + msg.author.tag);
		commands[msg.content.toLowerCase().slice(configFile.commandPrefix.length).split(' ')[0]](msg);
	}
})

client.login(configFile.botToken);
