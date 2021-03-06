const Discord = require('discord.js');
const client = new Discord.Client({autoReconnect: true});
var configFile = require('../config/config.json');
var commands = require('./commands.js');
commands = commands.commands;

process.title = 'wavebot';

process.on('exit', (code) => { console.log('Bot exiting ' + ((code > 0) ? 'with error' : 'normally') + ' at time: ' + Date()); client.destroy(); process.exit(code);});
process.on('SIGINT', () => { console.log('  Caught ^C, exiting... '); client.destroy(); process.exit(0);});
process.on('uncaughtException', (err) => { 
	console.log('UNCAUGHT EXCEPTION at time ' + Date() + '\n' + ((err && err.stack) ? err.stack : err) + '\n');
	client.destroy(); process.exit(1);
 });
process.on('unhandledRejection', (reason, p) => {
	//this is usually thrown by Discord error... common causes are connection errors...
	//we restart the bot if that is the case.
	console.log('UNHANDLED REJECTION at time ' + Date() + '\n' + 'Promise: ' + p + ' reason:' + reason);
	client.destroy(); process.exit(1);
});

client.on('ready', () =>{
	console.log('Bot now online. Time is ' + Date());
});

client.on('message', msg =>{
	//if (1 == 1 && !msg.author.bot) msg.react('🎉');  //festive boi
	if (!msg.content.startsWith(configFile.commandPrefix) || msg.author.bot) { return; }
	if (commands.hasOwnProperty(msg.content.toLowerCase().slice(configFile.commandPrefix.length).split(' ')[0])) {
		console.log(Date() + '| Running command "' + msg.content + '" sent by ' + msg.author.tag);
		commands[msg.content.toLowerCase().slice(configFile.commandPrefix.length).split(' ')[0]](msg);
	}
});

client.on('error', error =>{
	console.log('Connection error encountered at ' + Date());
	console.log('Details:' + error.message);
});

client.on('reconnecting', function(){
	//This code is run when bot is reconnecting, added for debugging connection errors
	console.log(Date() + ': Attempting to reconnect...');
});

client.login(configFile.botToken);
