const fs = require('fs');
const path = require('path');

const Discord = require('discord.js');
const tokens = require('../token.json'); //file for Discord Bot token.
const client = new Discord.Client({autoReconnect: true});

const botCommands = require('./botCommands.js');
const antispam = require('./antispam.js');
const statistics = require('./statistics.js');

//===============================
//These define the Node process itself, not the Discord Bot
process.title = 'wavebot';

process.on('exit', function(code){
	console.log('Bot process will exit with code: ' + code);
	console.log('Bot process exiting at time: ' + Date());
});

// process.on('uncaughtException', function(err){
// 	var errorLog = fs.createWriteStream('error.log', {autoClose: true});

// 	console.log('Uncaught exception at time: ' + Date());

// 	errorLog.write('Time now: ' + Date() + '\n' + ((err && err.stack) ? err.stack : err) + '\n');
// 	errorLog.end('\nEnd of error log at time: ' + Date() + '\n');
// 	errorLog.on('close', function() { bot.client.destroy(); process.exit(1);});
// });
//===============================
//End of Node process setup
//===============================
//Initial setup

//Create a customCommands.json file if it doesn't already exist.
fs.open('customCommands.json','r', function(err, fd){
	if (err){
		fs.writeFile(path.join(__dirname, '../src/customCommands.json'), '{ }', function(err){
			if(err){
				console.log(err); //log errors if customCommands.json cannot be created.
			}
			console.log("Successfully created customCommands.json!");
		});
	} else {
		console.log("customCommands.json already exist. Not doing any new work.");
	}
});

//================================
//End of Initial Setup
//================================

client.once('ready', () => {
	console.log('Time is now: ' + Date());
	console.log('I am currently in ' + client.guilds.array().length + ' server(s).');
	
	client.user.setStatus("online");
	client.user.setGame('/help to start');
})

client.on('message', function(message){
	if (antispam.antiSpamCheck(message)){ message.delete(); statistics.increaseRemovedCount(); }
	botCommands.readCommand(message, client);
	statistics.trackMessage(message);
})

client.login(tokens.botToken);

exports.client = client;