const Discord = require('discord.js');
const tokens = require('../token.json'); //file for Discord Bot token.
const permissions = require('./permissions.js');

var silentMode = false;

function readCommand(message, client){
	if (checkComandConditions(message)) return;

	const args = message.content.split(" ");
	args[0] = args[0].substring(1, args[0].length);

	console.log(Date() + ': Running command ' + message.content + ' typed by ' + message.author.username);

	// if (args[0].toLowerCase() === "silent" && permissions.checkPermissions(message)){
	// 	silentMode = !silentMode;
	// 	message.channel.send("Silent Mode set to " + silentMode);
	// }

	// if (silentMode) return;

	switch(args[0].toLowerCase()){
		case "ping":
			message.channel.send("```Retriving Ping...```").then(m => 
				m.edit(`:white_check_mark: | Ping is ${m.createdTimestamp - message.createdTimestamp}ms. Discord.js Ping is ${Math.round(client.ping)}ms`));
    		break;
    	case "say":
    		message.delete();
    		message.channel.send(message.content.substring(args[0].length + 1));
    		break;
    	case "exit":
    		if (permissions.checkPermissions(message)){
    			client.destroy().then(function() { process.exit(0);});
    		}
    		break;
    	case "eval":
    		if (permissions.checkPermissions(message)){
				code = message.content.substring(args[0].length+1);
				try {
					message.channel.send(`:white_check_mark: | Output:\n` + `\`\`\`${eval(code)}\`\`\``);
				} catch (err) {
					message.channel.send(`:warning: | Encountered error during eval:\n` + `\`\`\`${err}\`\`\``);
				}
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