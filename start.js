const auth = require("./auth.json");
const Discord = require("discord.js");
const bot = new Discord.Client({autoReconnect: true});
const fs = require('fs');
const util = require("util")

//These users from config has access to everything. 
const config = require("./config.json");
//CommandArray is used for /clrcom
const commandArray = ['/clear', '/ping', '/clrcom', '/help', '/say', '/sayin', '/exit', '/help', '/about', '/stat', '/antispam', '/eval', '/sleep', '/vote', '/results', '/poll'];

//passiveClear reads the DEFAULT VALUE from config.json to see
//if we activate antispam on startup.
var antiSpam = config.passiveClear;

//whiteListArray is used for detecting whitelisted words
const whiteListArray = config.whitelistWords;

//botOnlyChannel is the whitelisted channels that is immune from passiveClear.
const botOnlyChannels = config.botChannel;
//botOnlyServers is the list of servers that antispam should monitor.
const botOnlyServers = config.checkServers;

//Counters for stats
var messagesCount = 0;
var removedMessages = 0;
var commandCount = 0;

//var for /sleep command
var sleeping = false;

/* Variables for conducting polls */
var universalSuffrage = false;
var ausStyle = false;
var pollQuestion = "";
var jaArray = [];
var neinArray = [];
var absArray= [];

var errorLog = fs.createWriteStream('error.log', {flags: 'a'});

process.title = 'wavebot';

//I honestly don't know why this works. Catch unhandled exceptions and write to ???
process.on('uncaughtException', function(err) {
	console.log('Uncaught exception at time: ' + Date());
	bot.destroy();
	errorLog.write((err && err.stack) ? err.stack : err);
	errorLog.end('\nEnd of Error Log at time ' + Date() + '\n');
  	errorLog.on('finish', function(){
  		process.exit(1);
  });
});

process.on('exit', function(code){
	console.log('Bot process will exit with code: ' + code);
	console.log('Bot process exiting at time: ' + Date());
})

function checkPermissions(message){
	if (message.member.roles.find('name', 'Bot Commander') || message.author.id === '114721723894595589' || message.member.hasPermission('ADMINISTRATOR')) {
		//Check if use has role "Bot Commander" tagged or if writer of bot is trying ot run command.
		console.log(Date() + ': User ' + message.author.username + ' is admin, running command.');
		return true;
	} else {
		//Log the incident if it's not an authorised user.
		console.log('User ' + message.author.username + ' just attempted to run a admin only command and was denied.');
		message.channel.sendMessage('You do not have permission to execute the said command, this incident will be reported.');
		return false;
	}
}

function antiSpamFunction(message){

	/* Check if writer of message is:
	- A bot
	- Message is written in servers we watch as specified in the config
	- Message is NOT WRITTEN in whitelisted channels
	- Message DOES NOT contain whitelisted words
	- Message is NOT WRITTEN by WaveBot (ourselves)
	- antiSpam feature is currently active (as it can be disabled by user commands)
	*/
	if (message.author.bot === true && botOnlyChannels.indexOf(message.channel.id) === -1 && antiSpam === true && message.author != bot.user && botOnlyServers.indexOf(message.guild.id) > -1 && whiteListArray.indexOf(message.content.toLowerCase()) === -1){
		return true;
	} else if (whiteListArray.indexOf(message.content.toLowerCase()) > -1){
		console.log(Date() + ': Message \'' + message.content + '\' is whitelisted. Not removing.');
		return false;
	} else {
		return false;
	}
}

function findMessage(message){
	if (bot.user === message.author) {return true;}
}

function findUserMessages(message){
	for (var i = 0; i < commandArray.length; i++){
		if (message.content.toLowerCase().startsWith(commandArray[i])){
			return true;
		}
	}
	return false;
}

function spamFiltering(message){
	for (var i = 0; i < whiteListArray.length; i++){
		if (message.content.toLowerCase().startsWith(whiteListArray[i])){
			return true;
		}
	}
	return false;
}

bot.once("ready", () => {
	//This is run when the bot is ready in discord.
	//We use once to avoid many instances of the bot.
	console.log('Time is now: ' + Date());
	console.log('I am currently in ' + bot.guilds.array().length + ' server(s).');
	bot.user.setStatus("online");
	bot.user.setGame('/help to start');
});

bot.on('disconnect', function(){
	//This code is run when bot is disconnected
	console.log('------- Bot has disconnected from Discord. Time now: ' + Date());
});

bot.on('reconnecting', function(){
	//This code is run when bot is reconnecting
	console.log(Date() + ': Attempting to reconnect...');
});

bot.on('message', message => {
	messagesCount++;
	//If antispam function returns true, then the message is in an undesired channel,
	//originates from a bot, and will be removed.
	if (antiSpamFunction(message) === true){ 
		message.delete();
		removedMessages++;
	}
	if (message.content === '/sleep' && checkPermissions(message)){
		// /sleep is a special case and is nested outside giant command loop.
		if (sleeping){
			sleeping = false;
			message.channel.sendMessage(':loud_sound: | Will listen for user commands again!');
			return;
		} else {
			sleeping = true;
			message.channel.sendMessage(' :mute: | Quiet mode is now active - I will not respond to use commands. End quiet mode by running /sleep again.');
			return;
		}
	}

	if (message.content[0] === '/' && message.author.bot != true && sleeping === false){ 
		//if message starts with a /
		//and make sure we're not replying to a bot (including ourselves)
		console.log(Date() + ': ' + 'Treating message with content: "' + message.content + '" written by ' + message.author.username + ' as a command.');

		var commandText = message.content.split(" "); //Sort command and arguments into array

		commandCount++; //Increase command counter

		/* Commands */
		switch (commandText[0].toLowerCase()) {
			case "/ping":
				//Bot reply to /ping messages. Useful for checking uptimes.
				message.channel.sendMessage('*waves back*');
				break;

			case "/say":
				//Bot prints argument to channel.
				//Usage: /say <argument>
				if (!commandText[1]){
					message.channel.sendMessage('/say needs an argument: tell me what to say.');
					return;
				}
				message.channel.sendMessage(message.content.substring(commandText[0].length+1)); 
				break;

			case "/sayin":
				//Announce text after set delay
				//Usage: /sayin <Delay in mins> <Text to announce>
				if (checkPermissions(message)){
					var stringToPrint = message.content.substring(commandText[0].length + commandText[1].length + 2);
					stringToPrint = stringToPrint.replace("\\",'');
					setTimeout(function(){
						message.channel.sendMessage(stringToPrint);
					}, 1000 * 60 * commandText[1]);
					message.channel.sendMessage(' :timer: | You are all set! Message will be broadcasted after ' + commandText[1] + ' minutes.');
					console.log('Timer set.');
				}
				break;

			case "/clear":
				//Clear all messages from the bot.
				message.delete();
				console.log(message.author.username + ' requested to clear bot messages.');
				
				if (checkPermissions(message) && message.guild.member(bot.user).permissions.hasPermission("MANAGE_MESSAGES")){
					message.channel.fetchMessages({limit: 100}).then(function (m){
						filtered = m.filter(findMessage.bind(this));
						try {
								if (filtered.size >=2 ){
									message.channel.bulkDelete(filtered);
									message.reply(' :white_check_mark: | I deleted ' + filtered.size + ' of my messages from this channel.');
								} else {
									message.reply('Due to Discord limitations, you need to delete more than 1 of my messages at once.');
								}
							} catch (e){
								message.reply(':warning: | Failed to delete message. Check console.');
								console.log(Date() + '- Error output:' + e);
							}
						})
				} else if (!message.guild.member(bot.user).permissions.hasPermission("MANAGE_MESSAGES")){
					message.channel.sendMessage(':warning: | Bot has no server permission (MANAGE_MESSAGES) to manage messages.');
				}
				break;

			case "/clrcom":
				//Clear all command messages from users.
				if (checkPermissions(message) && message.guild.member(bot.user).permissions.hasPermission("MANAGE_MESSAGES")){
					message.channel.fetchMessages({limit: 100}).then(function (m){
						filtered = m.filter(findUserMessages.bind(this));
						try {
								if (filtered.size >=2 ){
									message.channel.bulkDelete(filtered);
									message.reply(' :white_check_mark: | I deleted ' + filtered.size + ' of commands from this channel.');
								} else {
									message.reply('Due to Discord limitations, you need to delete more than 1 of my messages at once.');
								}
							} catch (e){
								message.channel.sendMessage(':warning: | Failed to delete message. Check console.');
								console.log(Date() + '- Error output:' + e);
							}
						})
				} else if (!message.guild.member(bot.user).permissions.hasPermission("MANAGE_MESSAGES")){
					message.channel.sendMessage(':warning: | Bot has no server permission (MANAGE_MESSAGES) to manage messages.');
				}

				break;

			case "/antispam":
				//Toggle anti-spam detection.
				if (checkPermissions(message)){
					if (antiSpam === true){
						antiSpam = false;
						message.reply(':white_check_mark: | Bot Anti-spam is now toggled TO OFF.');
					} else {
						antiSpam = true;
						message.channel.sendMessage(':white_check_mark: | Bot Anti-spam is now toggled TO ON.');
					}
				}
				break;

			case "/exit":
				//Exit the bot process.
				if (checkPermissions(message)){
					console.log(Date() + ': Shuting down bot by /exit command.');
					bot.destroy().then(function(){
						process.exit(0);
					});
				} else {
					console.log('User (name: ' + message.author.username + ' | ID: ' + message.author.id  + ') tried to shutdown the bot and was denied.');
				}
				break;

			case "/help":
				//Print to the user's DM so we don't spam server.
				message.channel.sendMessage('Please check your direct message :D');
				//I know. Don't ask why.
				message.author.sendMessage('***Command List***\n' +
					'/help - Show this message\n' +
					'/ping - Pings the bot, useful for checking my status\n' +
					'/say <text> - Prints something into text channel\n' +
					'***Admin Only ***\n' + 
					'/clear - Clear all output from WaveBot in text channel\n' + 
					'/clrcom - Clear all commands from users to WaveBot in text channel\n' + 
					'/clearall - Clear ALL bot outputs in a text channel, including WaveBot\n' +
					'/antispam - Toggle antispam for automatically deleting bot outputs in non-bot channels\n' +
					'/sayin <delay in mins> <text> - After delay, print text into text channel\n' +
					'/exit - Exit this bot');
				break;
				
			case "/about":
				//Prints the about me to a user's DM.
				message.channel.sendMessage('Please check your direct messages :D');
				message.author.sendMessage('Hi, \n' +
					'I am made by <@114721723894595589> :D\n' +
					"I am up for: " + (Math.round(bot.uptime / (1000 * 60 * 60))) + " hours, " + (Math.round(bot.uptime / (1000 * 60)) % 60) + " minutes, and " + (Math.round(bot.uptime / 1000) % 60) + " seconds.\n" +
					'Check out my source code here: https://github.com/Frozemint/WaveBot');
				break;

			
			case "/stat":
				//View bot stats
				message.channel.sendMessage('Currently logged in as: ' + bot.user.username + '\n' +
					"I am up for: " + (Math.round(bot.uptime / (1000 * 60 * 60))) + " hours, " + (Math.round(bot.uptime / (1000 * 60)) % 60) + " minutes, and " + (Math.round(bot.uptime / 1000) % 60) + " seconds.\n" +
					"You are an admin: " + (config.allowedUsers.indexOf(message.author.id) > -1) +
					"\nCurrently tracked " + messagesCount + " messages, in which " + removedMessages + " were flagged and deleted.");
				message.channel.sendCode('js', '')
				break;

			case "/eval":
				// /eval runs arbitary javascript code.
				if (checkPermissions(message)){
					try {
						var code = message.content.substring(commandText[0].length+1);

						message.channel.sendCode('js', eval(code));
					} catch (err){
						message.channel.sendMessage('Encountered an error during eval: \n' + err);
					}
				} else {
					console.log('User (name: ' + message.author.username + ' | ID: ' + message.author.id  + ') tried to /eval and was denied.');
				}
				break;

			/* Poll code */

			case "/poll":
				//Only admins can create polls and check if poll question exist
				if (checkPermissions(message)){
					//universalSuffrage is false when there is no active polls
					if (universalSuffrage === false && commandText[0]){
						pollQuestion = message.content.substring(commandText[0].length+1);
						message.reply(' :mega: | Started a poll on: ' + pollQuestion + '\nVote with /vote <yes/no/abstain>!');
						neinArray = []; //Clear previous poll results
						jaArray = [];
						absArray = [];
						universalSuffrage = true;
					} else if (universalSuffrage === true) {
						//Check if polls is running before closing it.
						message.channel.sendMessage('Poll on: ' + pollQuestion + ' is now CLOSED!');
						message.channel.sendCode('asciidoc', `= FINAL VOTING RESULTS ON: ${pollQuestion} =
• Yes     :: ${jaArray.length} votes (${(jaArray.length/(jaArray.length+neinArray.length+absArray.length))*100}%)
• No      :: ${neinArray.length} votes (${(neinArray.length/(jaArray.length+neinArray.length+absArray.length))*100}%)
• Abstain :: ${absArray.length} votes (${(absArray.length/(jaArray.length+neinArray.length+absArray.length))*100}%)`);
						universalSuffrage = false;
					}
				}
				break;

			case "/vote":
				if (universalSuffrage === false){ //Check if there is a poll in progress.
					message.reply('There are currently no polls in progress.');
					return;
				}
				if (jaArray.indexOf(message.author.id) === -1 && neinArray.indexOf(message.author.id) === -1 && absArray.indexOf(message.author.id) === -1){
					switch (commandText[1].toLowerCase()){
						case "yes":
							jaArray.push(message.author.id);
							break;
						case "no":
							neinArray.push(message.author.id);
							break;
						case "abstain":
							absArray.push(message.author.id);
							break;
						default:
							message.reply('Please specify your vote: Yes, No, or Abstain.');
							return;
					}
					message.reply(' :ballot_box_with_check: | You have successfully casted a '  + commandText[1].toUpperCase() + ' vote on the question: ' + pollQuestion);
				} else if (jaArray.indexOf(message.author.id) > -1 || neinArray.indexOf(message.author.id) > -1 || absArray.indexOf(message.author.id) > -1){
					message.reply('You have already voted once!');
					break;
				}
				//no BREAK statement as we always display results after a vote.

			case "/results":
				if (universalSuffrage === false){
					message.channel.sendMessage('There are currently no polls in progress.');
					return;
				}
				//message.channel.sendMessage('Results for poll on question: ' + pollQuestion + '\nYes: ' + jaArray.length + ' votes' + '\nNo: ' + neinArray.length + ' votes' + '\nAbstain: ' + absArray.length + ' votes');
				message.channel.sendCode('asciidoc', `= VOTING RESULTS ON: ${pollQuestion} =
• Yes     :: ${jaArray.length} votes (${(jaArray.length/(jaArray.length+neinArray.length+absArray.length))*100}%)
• No      :: ${neinArray.length} votes (${(neinArray.length/(jaArray.length+neinArray.length+absArray.length))*100}%)
• Abstain :: ${absArray.length} votes (${(absArray.length/(jaArray.length+neinArray.length+absArray.length))*100}%)`);
				break;

			default:
				//This section will run if we run all the comparing above and 
				//none was found.
				message.channel.sendMessage('Command not found. Try running /help.');
				break;
		}

	}
});

//Login.
bot.login(auth.token);
