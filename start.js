//WaveBot start.js

const bot = require('./src/bot.js');
const auth = require('./auth.json');
const fs = require('fs');
const util = require('util');


process.title = 'wavebot';

process.on('uncaughtException', function(err){
	var errLog = fs.createWriteStream('error.log', {flags: 'a'});
	console.log('Uncaught exception at time: ' + Date());
	bot.destroy();
	errorLog.write('BEGIN ERROR LOG at time ' + Date() + '\n');
	errorLog.write((err && err.stack) ? err.stack : err);
	errorLog.end('\nEnd of Error Log at time ' + Date() + '\n\n');
	errorLog.on('finish', function(){
		process.exit(1);
	});
});

process.on('exit', function(code){
	console.log('Bot process will exit with code: ' + code);
	console.log('Bot process exiting at time: ' + Date());
});

bot.login(auth.token);