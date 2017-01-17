const bot = require('./bot.js');
const botFunctions = require('./functions.js');
const votingFunctions = require('./voting.js');
const permissionFunction = require('./permissions.js');
const jokeCommands = require('./jokecommands.js');

//Counters for stats
var messagesCount = 0,removedMessages = 0, commandCount = 0;

function increaseRemovedCounter(){
	removedMessages++;
}

function increaseMessageCounter(){
	messagesCount++;
}

function increaseCommandCounter(){
	commandCount++;
}

function readBotCommand(client, message){
		commandText = message.content.split(" ");
		commandText[0] = commandText[0].substring(1, commandText[0].length);
		messagesCount++;
		console.log(Date() + ': Treating ' + message.content + ' typed by ' + message.author.username + ' as a command.');

		switch(commandText[0].toLowerCase()){
				case "ping":
					return '*waves back*';
				case "say":
					if (!commandText[1]){ return ':warning: | You need to tell me what to say.';}
					return message.content.substring(commandText[0].length+1);
				case "sayin":
					stringToAnnounce = message.content.substring(commandText[0].length + commandText[1].length + 2);
					stringToAnnounce = stringToAnnounce.replace('\\', '');
					setTimeout(function(){ message.channel.sendMessage(stringToAnnounce)}, 1000 * 60 * commandText[1]);
					return ' :timer: | You are set! Message will be broadcasted after ' + commandText[1] + ' minutes.';
				case "exit":
					if (permissionFunction.checkPermissions(message)){
						client.destroy().then(function() { process.exit(0);});
					}
					break;
				case "addcom":
					if (permissionFunction.checkPermissions(message) && commandText[0] && commandText[1]){
						return jokeCommands.addCustomCommand(commandText[1], message.content.substring(commandText[0].length + commandText[1].length + 2));
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
							message.channel.sendCode('xl', eval(code));
						} catch (err){
							message.channel.sendMessage(`:warning: | Encountered error during eval:\n` + `\`\`\`${err}\`\`\``);
						}
					}
					break;
				case "info":
					return `Information on WaveBot:\n` + `\`\`\`Logged in as     : ${client.user.username}
Discord uptime   : ${Math.floor(client.uptime / (1000 * 60 * 60 * 24))} days ${Math.floor(client.uptime / (1000 * 60 * 60))} hours ${Math.floor(client.uptime / (1000 * 60))% 60} minutes ${Math.floor(client.uptime / 1000) % 60} seconds
Process uptime   : ${Math.floor(process.uptime() / (60 * 60 * 24))} days ${Math.floor(process.uptime() / (60 * 60))} hours ${Math.floor(process.uptime() / 60)% 60} minutes ${Math.floor(process.uptime() % 60)} seconds
Messages tracked : ${messagesCount}
Removed messages : ${removedMessages}
Commands ran     : ${commandCount}\`\`\``;

				case "antispam":
					if (permissionFunction.checkPermissions(message)){
						return botFunctions.toggleAntispam();
					}
					break;
				case "clear":
					if (permissionFunction.checkPermissions(message)){
						botFunctions.clearMessages(message);
					}
					break;

				case "poll":
					if (!commandText[1]){ return ('Try /poll <question/options/start/end> [Options...]');}
					if (permissionFunction.checkPermissions(message) === false){ return;}
					switch (commandText[1].toLowerCase()){
						case "question": //Two cases here because people keeps adding an s at the end
						case "questions":
							return votingFunctions.setQuestion(message.content.substring(commandText[0].length+commandText[1].length+3));
						case "option":
						case "options":
							return votingFunctions.setOptions(commandText);
						case "defaults":
						case "default":
							return votingFunctions.setDefaults(message.channel.id);
						case "start":
							return votingFunctions.startPoll(message.channel.id);
						case "end":
							finalResult = votingFunctions.endPoll();
							message.channel.sendCode('asciidoc', finalResult);
							break;
						default:
							return ('Try /poll <question/options/start/end> [Options...]');
					}
					break;
			case "result":
			case "results":
				resultString = votingFunctions.printResults();
				message.channel.sendCode('asciidoc', resultString);
				break;
			case "vote":
				return votingFunctions.castVote(message.channel.id, commandText[1], message.author.id, message.author.username);
				break;

			case "help":
					message.author.sendMessage('**Command List for WaveBot**\n'+
					`\`\`\`/ping - Pings WaveBot. Useful for checking on Bot.
/say <content> - Makes WaveBot type <content> into the text channel the command was ran
/about - Prints information about WaveBot
/info - Prints statistics about WaveBot
/vote <option> - Vote for <option> when a poll is active
/results - Used to view results of a poll when a poll is active
/sayin <content> <delay in minutes> - WaveBot will announce <content> after <delay in minutes> in the channel the command was ran
\n----- Admin Commands -----\n
/clear - Clear all WaveBot output and user input from the channel this command was ran
/antispam - Toggle the automated removal of bot messages from unwanted channels
/poll <question/options/default/start/end> [options...] - Used to host a poll
/eval <javascript code> - Used to run arbitary Javascript Code. USE WITH CAUTION!
/exit - Exits WaveBot\`\`\``);
				break;
				default:
					//If typed command does not match anything, search the joke commands
					return jokeCommands.readJokeCommand(commandText[0]);
					break;
		}
}

module.exports = {
	readBotCommand: readBotCommand,
	increaseRemovedCounter: increaseRemovedCounter,
	increaseMessageCounter: increaseMessageCounter,
	increaseCommandCounter: increaseCommandCounter

}