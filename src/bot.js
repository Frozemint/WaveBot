const Discord = require('discord.js');
const client = new Discord.Client({autoReconnect: true});
var configFile = require('../config/config.json');
var commands = require('./commands.js');
commands = commands.commands;

process.stdin.resume();

function exitHandler(option, err){
	console.log('Process exiting at: ' + Date());
	client.destroy();
	if (err) {
		console.log('Time is now: ' + Date());
		console.log('Error stack: \n\n' + err.stack);
	}
	if (option.exit) {
		process.exit();
	}
}

process.on('exit', exitHandler.bind(null,{exit:true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

client.on('ready', () =>{
	console.log('Bot ready.');
})

client.on('message', msg =>{
	if (1 == 1 && !msg.author.bot) msg.react('🎉');  //festive boi
	if (!msg.content.startsWith(configFile.commandPrefix) || msg.author.bot) return;
	if (commands.hasOwnProperty(msg.content.toLowerCase().slice(configFile.commandPrefix.length).split(' ')[0])) commands[msg.content.toLowerCase().slice(configFile.commandPrefix.length).split(' ')[0]](msg);
})

client.login(configFile.botToken);