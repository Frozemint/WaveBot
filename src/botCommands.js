const Discord = require('discord.js');
const tokens = require('../token.json'); //file for Discord Bot token.
const permissions = require('./permissions.js');

function readCommand(message, client){
	if (checkComandConditions(message)) return;

	const args = message.content.split(" ");
	args[0] = args[0].substring(1, args[0].length);

	console.log(Date() + ': Running command ' + message.content + ' typed by ' + message.author.username);

	switch(args[0].toLowerCase()){
		case "ping":
			message.channel.send("Retriving Ping...").then(m => 
				m.edit(`Ping is ${m.createdTimestamp - message.createdTimestamp}ms. Discord.js Ping is ${Math.round(client.ping)}ms`));
    		break;
    	case "exit":
    		if (permissions.checkPermissions(message)){
    			client.destroy().then(function() { process.exit(0);});
    		}
    		break;
    	default:
    		break;
	}
}

function checkComandConditions(message){
	return (message.author.bot ||
		!message.content.startsWith(tokens.prefix) ||
		message.channel instanceof Discord.DMChannel);
}

module.exports = {
	readCommand: readCommand
}