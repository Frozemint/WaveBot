const Discord = require('discord.js');
const tokens = require('../token.json'); //file for Discord Bot token.
const permissions = require('./permissions.js');
const antispam = require('./antispam.js');
const statistics = require('./statistics.js');


function readCommand(message, client){
	if (checkComandConditions(message)) return;

	const args = message.content.split(" ");
	args[0] = args[0].substring(1, args[0].length);

	console.log(Date() + ': Running command ' + message.content + ' typed by ' + message.author.tag);

	switch(args[0].toLowerCase()){
		case "ping":
			message.channel.send("```Retriving Ping...```").then(m => 
				m.edit(`:white_check_mark: | Ping is ${m.createdTimestamp - message.createdTimestamp}ms. Discord.js Ping is ${Math.round(client.ping)}ms`));
    		break;
    	case "say":
    		if (permissions.checkPermissions(message)){
    			message.delete();
    			message.channel.send(message.content.substring(args[0].length + 1));
    		}
    		break;
    	case "info":
    		message.channel.send(statistics.printStatistics());
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
		case "clear":
			if (permissions.checkPermissions(message) && args[1]){
				antispam.clearMessages(message, args[1]);
			} else if (!args[1]){
				message.channel.send(":information_source: | You need to specify how many messages to screen for deleting.");
			}
    		break;
    	case "invite":
			 message.channel.send('Invite link for WaveBot: https://discordapp.com/api/oauth2/authorize?client_id=233380635777957890&scope=bot&permissions=0x00002000');
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