const Discord = require('discord.js');
const bot = require('./bot.js');
const botFunctions = require('./functions.js');
const votingFunctions = require('./voting.js');
const permissionFunction = require('./permissions.js');
const jokeCommands = require('./jokecommands.js');
const settingAgent = require('./settings.js');

//Counters for stats
var messagesCount = removedMessages = commandCount = totalBotMessages = 0;

function increaseRemovedCounter(){
	removedMessages++;
}

function increaseMessageCounter(){
	messagesCount++;
}

function increaseCommandCounter(){
	commandCount++;
}

function increaseBotMessageCounter(){
	totalBotMessages++;
}

function readBotCommand(client, message){
	//Read Bot Command and handle it accordingly
	commandText = message.content.split(" ");
	commandText[0] = commandText[0].substring(1, commandText[0].length);
	messagesCount++;
	console.log(Date() + ': Treating ' + message.content + ' typed by ' + message.author.username + ' as a command.');

	switch(commandText[0].toLowerCase()){
		case "ping":
			return '*waves back*';
			break;
		case "say":
			message.delete();
			if (!commandText[1]){ return ':warning: | You need to tell me what to say.';}
			message.channel.send(message.content.substring(commandText[0].length+1));
			break;
		case "exit":
			//If a process manager like PM2 is used, this merely restarts the bot
			if (permissionFunction.checkPermissions(message)){
				client.destroy().then(function() { process.exit(0);});
			}
			break;
		case "addcom":
			if (permissionFunction.checkPermissions(message) && commandText[0] && commandText[1]){
				return jokeCommands.addCustomCommand(message, commandText[1], message.content.substring(commandText[0].length + commandText[1].length + 2));
			}
			break;
		case "delcom":
			if (permissionFunction.checkPermissions(message) && commandText[1]){
				return jokeCommands.removeCustomCommand(commandText[1]);
			}
			break;

		case "eval":
			if (permissionFunction.checkPermissions(message)){
				try {
					code = message.content.substring(commandText[0].length+1);
					message.channel.send(`:white_check_mark: | Output:\n` + `\`\`\`${eval(code)}\`\`\``);
				} catch (err){
					message.channel.send(`:warning: | Encountered error during eval:\n` + `\`\`\`${err}\`\`\``);
				}
			}
			break;
		case "setting":
		case "settings":
			if (!commandText[1] || !commandText[2]){ return "Do /setting [prefix/addchannel/delchannel] [argument]";}
			if (!permissionFunction.checkPermissions(message)){ return false;}
			switch (commandText[1].toLowerCase()){
				case "prefix":
					settingAgent.changeBotPrefix(message, commandText[2]);
					break;
				case "addchannel":
					settingAgent.addBotChannel(message, commandText[2]);
					break;
				case "delchannel":
					settingAgent.removeBotChannel(message, commandText[2]);
					break;
				case "addserver":
					break;
				default:
					break;
			}

			break;
		case "mcserver":
			if (!commandText[1]) {return "Do /mcserver [ip] or 'pool' to get server status of Poolandia.";}
			if (commandText[1].toLowerCase() === 'pool'){
				botFunctions.minecraftServerInfo('poolandia.mcph.co', message);
				//Yeah not using return because fuck getting that to work
			} else {
				botFunctions.minecraftServerInfo(commandText[1], message);
				//Yeah not using return because fuck getting that to work
			}
			break;
		case "info":
			return `Information on WaveBot:\n` + `\`\`\`Logged in as       : ${client.user.username}
Discord uptime     : ${Math.floor(client.uptime / (1000 * 60 * 60 * 24))} days ${Math.floor(client.uptime / (1000 * 60 * 60)) % 24} hours ${Math.floor(client.uptime / (1000 * 60))% 60} minutes ${Math.floor(client.uptime / 1000) % 60} seconds
Process uptime     : ${Math.floor(process.uptime() / (60 * 60 * 24))} days ${Math.floor(process.uptime() / (60 * 60) % 24)} hours ${Math.floor(process.uptime() / 60)% 60} minutes ${Math.floor(process.uptime() % 60)} seconds
Messages tracked   : ${messagesCount}
Removed messages   : ${removedMessages}
Total Bot Messages : ${totalBotMessages}
Commands ran       : ${commandCount}\`\`\``;

		case "antispam":
			if (permissionFunction.checkPermissions(message)){
				return botFunctions.toggleAntispam();
			}
			break;
		case "clear":
			if (permissionFunction.checkPermissions(message)){
				if (!commandText[1]){
					message.channel.send('Messages to fetch unspecified, defaulting to 100.');
					return botFunctions.clearMessages(message, 100);
				} else {
					return botFunctions.clearMessages(message, commandText[1]);
				}
			}
			break;

		case "poll":
			if (!commandText[1]){ return ('Try /poll <question/options/start/end> [Options...]');}
			if (permissionFunction.checkPermissions(message) === false){ return;}
			//Create an object for storing server data if it does not already exist
			votingFunctions.createServerObject(message.guild.id);
			switch (commandText[1].toLowerCase()){
				case "secret":
					return votingFunctions.setSecret(message.guild.id);
				case "question": //Two cases here because people keeps adding an s at the end
				case "questions":
					return votingFunctions.setQuestion(message.content.substring(commandText[0].length+commandText[1].length+3),message.guild.id);
				case "option":
				case "options":
					return votingFunctions.setOptions(commandText,message.guild.id);
				case "defaults":
				case "default":
					return votingFunctions.setDefaults(message.channel.id, message.guild.id);
				case "start":
					return votingFunctions.startPoll(message.channel.id,message.guild.id);
				case "end":
					finalResult = votingFunctions.endPoll(message.guild.id);
					message.channel.send(finalResult, {code: 'diff'});
					break;
				default:
					return ('Try /poll <question/options/start/end> [Options...]');
			}
			break;

	case "result":
	case "results":
		if (!commandText[1]){
			resultString = votingFunctions.printResults(message.guild.id);
			message.channel.send(resultString, {code: 'diff'});
		} else if (commandText[1] === 'raw'){
			resultString = votingFunctions.printRawResults(message.guild.id);
			message.channel.send('Raw data dump on this server\'s voting data:\n' + `\`\`\` ${resultString}\`\`\``);
		}
		break;
	case "vote":
		return votingFunctions.castVote(message, message.guild.id, commandText[1], message.author.id, message.author.username);
		break;
	case "invite":
			return ('Invite link for WaveBot: https://discordapp.com/api/oauth2/authorize?client_id=233380635777957890&scope=bot&permissions=0x00002000')
		default:
			//If typed command does not match anything, search the joke commands
			return jokeCommands.readJokeCommand(commandText);
			break;
	}
}

module.exports = {
	readBotCommand: readBotCommand,
	increaseRemovedCounter: increaseRemovedCounter,
	increaseMessageCounter: increaseMessageCounter,
	increaseCommandCounter: increaseCommandCounter,
	increaseBotMessageCounter: increaseBotMessageCounter
}
