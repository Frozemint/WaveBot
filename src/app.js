//WaveBot start.js

const bot = require('./bot.js');
const auth = require('./config/auth.json');
const fs = require('fs');
const util = require('util');


process.title = 'wavebot';

process.on('uncaughtException', function(err){
	var errorLog = fs.createWriteStream('error.log', {autoClose: true});

	console.log('Uncaught exception at time: ' + Date());

	errorLog.write('Time now: ' + Date() + '\n' + ((err && err.stack) ? err.stack : err) + '\n');
	errorLog.end('\nEnd of error log at time: ' + Date() + '\n');
	errorLog.on('close', function() { bot.client.destroy(); process.exit(1);});
});

process.on('exit', function(code){
	console.log('Bot process will exit with code: ' + code);
	console.log('Bot process exiting at time: ' + Date());
});

bot.client.login(auth.token);