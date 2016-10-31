const auth = require("./auth.json");
const Discord = require("discord.js");
const bot = new Discord.Client();

//These users from config has access to everything. 
const config = require("./config.json");
//CommandArray is used for /clrcom
const commandArray = ['/clear', '/ping', '/clrcom', '/help', '/say', '/civin', '/clearall', '/exit', '/help', '/about'];

//passiveClear reads the DEFAULT VALUE from config.json to see
//if we activate antispam on startup.
var antiSpam = config.passiveClear;

//botOnlyChannel is the whitelisted channels that is immune from passiveClear.
const botOnlyChannels = config.botChannel;
//botOnlyServers is the list of servers that antispam should monitor.
const botOnlyServers = config.checkServers;


process.on('SIGINT', exitHandler.bind({reason: 'SIGINT'}));
process.on('exit', exitHandler.bind({reason: 'Exiting.'}));
process.on('SIGTERM', exitHandler.bind({reason: 'SIGKILL'}));

function exitHandler(reason){
	//Exit handler for checking why the bot exits.
	console.log('\nQUITTING. Reason: ' + this.reason);
	bot.destroy().then(function(){
		//Logs out of discord before exiting.
  		process.exit();
  });
}

function checkPermissions(user){
	//This function checks the permission of a user against
	//the config.json array of trusted users.
	if (config.allowedUsers.indexOf(user.id) > -1){
		console.log('User ' + user.username + ' is admin, running command.');
		return true;
	} else {
		console.log('User ' + user.username + ' just attempted to run a admin only command and was denied.');
		message.channel.sendMessage('You do not have permission to execute the said command, this incident will be reported.');
	}
}

function antiSpamFunction(message){
	
	if (message.author.bot === true && botOnlyChannels.indexOf(message.channel.id) === -1 && antiSpam === true && message.author != bot.user && botOnlyServers.indexOf(message.guild.id) > -1){
		console.log(Date() + 'Flagged message from bot: ' + message.author.username + ' as spam and will be removed.');
		return true;
	} else {
		return false;
	}
}

bot.on("ready", () => {
	//This is run when the bot is ready in discord.
	console.log('Time is now: ' + Date());
	console.log('I am currently in ' + bot.guilds.array().length + ' server(s).');
	bot.user.setStatus("online", '/help to start');
});


bot.on('message', message => {
	//If antispam function returns true, then the message is in an undesired channel,
	//originates from a bot, and will be removed.
	if (antiSpamFunction(message) === true){ 
		message.delete();
	}

	if (message.content[0] === '/' && message.author.bot != true){ 
	//if message starts with a /
	//and make sure we're not replying to a bot (including ourselves)
		console.log(Date() + ': ' + 'Treating message with content: "' + message.content + '" written by ' + message.author.username + ' as a command.');

		var commandText = message.content.split(" "); //Sort command and arguments into array

		message.delete();

		/* Commands */
		switch (commandText[0].toLowerCase()) {
			case "/ping":
				//Ping the bot.
				message.channel.sendMessage('*waves back*');
				break;

			case "/say":
				//Bot prints argument to channel.
				//Usage: /say <argument>
				message.channel.sendMessage(message.content.substring(commandText[0].length+1)); 
				break;

			case "/civin":
				//Announce text after set delay
				//Usage: /civin <Delay in mins> <Text to announce>
				if (checkPermissions(message.author)){
					var stringToPrint = message.content.substring(commandText[0].length + commandText[1].length + 2);
					stringToPrint = stringToPrint.replace("\\",'');
					setTimeout(function(){
						message.channel.sendMessage(stringToPrint);
					}, 1000 * 60 * commandText[1]);
					console.log('Timer set.');
				}
				break;

			case "/clear":
				//Clear all messages from the bot.
				//message.delete();
				console.log(message.author.username + ' requested to clear bot messages.');
				
				if (checkPermissions(message.author)){
					if(message.guild.member(bot.user).permissions.hasPermission("MANAGE_MESSAGES")){
						message.channel.fetchMessages({limit: 100}).then(messages => {
							message.channel.bulkDelete(messages.filter(function(selectedMessage){
								if (selectedMessage.author.id === bot.user.id){
									return true;
								}
								
								return false;
							}))
						});
					} else {
						message.channel.sendMessage("Bot has no permission to perform operation.");
					}
				}
				break;

			case "/clrcom":
				//Clear all command messages from users.
				//message.delete();
				if (checkPermissions(message.author)){

					console.log(message.author.username + ' requested to clear all entered user commands from channel : ' + message.channel);

					if (message.guild.member(bot.user).permissions.hasPermission("MANAGE_MESSAGES")){
						message.channel.fetchMessages({limit: 100}).then(messages =>{
							message.channel.bulkDelete(messages.filter(function(selectedMessage){
								selectedMessage = selectedMessage.content.toLowerCase();
								if (commandArray.indexOf(selectedMessage) > -1 || selectedMessage.startsWith('/civin')){
									return true;
								}
								return false;
							}))
						});
					} else {
						message.channel.sendMessage("Bot has no permission to perform operation.");
					}
				}

				break;

			case "/clearall":
				//Clear ALL messages from bots.
				if (checkPermissions(message.author)){
					if(message.guild.member(bot.user).permissions.hasPermission("MANAGE_MESSAGES")){
						message.channel.fetchMessages({limit: 100}).then(messages => {
							message.channel.bulkDelete(messages.filter(function(selectedMessage){
								if (selectedMessage.author.bot === true){
									return true;
								}
								
								return false;
							}))
						});
					} else {
						message.channel.sendMessage("Bot has no permission to perform operation.");
					}
				}
				break;

			case "/antispam":
				//Toggle anti-spam detection.
				if (checkPermissions(message.author)){
					if (antiSpam === true){
						antiSpam = false;
						message.channel.sendMessage('Admin: Bot Anti-spam is now toggled TO OFF.');
					} else {
						antiSpam = true;
						message.channel.sendMessage('Admin: Bot Anti-spam is now toggled TO ON.');
					}
				}
				break;

			case "/exit":
				//Exit the bot process.
				if (checkPermissions(message.author)){
					console.log('Shuting down bot by /exit command.');
					process.exit(0);
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
					'/civin <delay in mins> <text> - After delay, print text into text channel\n' +
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

			default:
				//This section will run if we run all the comparing above and 
				//none was found.
				message.channel.sendMessage('Command not found. Try running /help?');
				break;
		}

	}
});

//Login.
bot.login(auth.token);