let auth     = require('./config/auth.json'),
	Discord  = require('discord.js');
 	fs       = require('fs'),
	util     = require('util'),
	bot      = require('./bot.js'),
	commands = require('./commands.js'),
	config   = require('./config/config.json');

//passiveClear reads the DEFAULT VALUE from config.json to see
//if we activate antispam on startup.
let antiSpam = config.passiveClear;
//whiteListArray is used for detecting whitelisted words
let whiteListArray = config.whitelistWords;
//botOnlyChannel is the whitelisted channels that is immune from passiveClear.
let botOnlyChannels = config.botChannel;
//botOnlyServers is the list of servers that antispam should monitor.
let botOnlyServers = config.checkServers;
//CommandPrefix is the prefix of a command.
let commandPrefix = config.commandPrefix; 

//Counters for stats
let messagesCount = 0;
let removedMessages = 0;
let commandCount = 0;

//let for /sleep command
let sleeping = false;
let universalSuffrage = false;

process.title = 'wavebot';

//I honestly don't know why this works. Catch unhandled exceptions and write to ???
process.on('uncaughtException', function(err) {
	let errorLog = fs.createWriteStream('error.log', {flags: 'a'});
	console.log('Uncaught exception at time: ' + Date());
	bot.destroy();
	errorLog.write((err && err.stack) ? err.stack : err)
			.end('\nEnd of Error Log at time ' + Date() + '\n')
  			.on('finish', function(){ process.exit(1); });
});

process.on('exit', function(code){
	console.log('Bot process will exit with code: ' + code);
	console.log('Bot process exiting at time: ' + Date());
})

//Login.
bot.login(auth.token);
