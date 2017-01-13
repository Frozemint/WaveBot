let bot = require('./bot.js');
let functions = require('./functions.js');

module.exports = bot.on('message', message => {
	messagesCount++;
	//If antispam function returns true, then the message is in an undesired channel,
	//originates from a bot, and will be removed.
	if (functions.antiSpamFunction(message) === true){ 
		message.delete();

		removedMessages++;
	}
	if (message.content === '/sleep' && functions.checkPermissions(message)){
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

	if (message.content[0] === commandPrefix && message.author.bot != true && sleeping === false){ 
		//if message starts with a /
		//and make sure we're not replying to a bot (including ourselves)
		console.log(Date() + ': ' + 'Treating message with content: "' + message.content + '" written by ' + message.author.username + ' as a command.');

		let commandText = message.content.split(" "); //Sort command and arguments into array
		commandText[0] = commandText[0].substring(1, commandText[0].length);

		commandCount++; //Increase command counter

		/* Commands */
		switch (commandText[0].toLowerCase()) {
			case "ping":
				//Bot reply to /ping messages. Useful for checking uptimes.
				message.channel.sendMessage('*waves back*');
				break;

			case "say":
				//Bot prints argument to channel.
				//Usage: /say <argument>
				if (!commandText[1]){
					message.channel.sendMessage(':warning: | /say needs an argument: tell me what to say.');
					return;
				}
				message.channel.sendMessage(message.content.substring(commandText[0].length+1)); 
				break;

			case "sayin":
				//Announce text after set delay
				//Usage: /sayin <Delay in mins> <Text to announce>
				if (functions.checkPermissions(message)){
					let stringToPrint = message.content.substring(commandText[0].length + commandText[1].length + 2);
					stringToPrint = stringToPrint.replace("\\",'');
					setTimeout(function(){
						message.channel.sendMessage(stringToPrint);
					}, 1000 * 60 * commandText[1]);
					message.channel.sendMessage(' :timer: | You are all set! Message will be broadcasted after ' + commandText[1] + ' minutes.');
					console.log('Timer set.');
				}
				break;

			case "clear":
				//Clear all messages from the bot.
				message.delete();
				console.log(message.author.username + ' requested to clear bot messages.');
				
				if (functions.checkPermissions(message) && message.guild.member(bot.user).permissions.hasPermission("MANAGE_MESSAGES")){
					message.channel.fetchMessages({limit: 100}).then(function (m){
						filtered = m.filter(functions.findMessage.bind(this));
						try {
								if (filtered.size >=2 ){
									message.channel.bulkDelete(filtered);
									message.reply(' :white_check_mark: | I deleted ' + filtered.size + ' of my messages from this channel.');
									removedMessages += filtered.size;
								} else {
									message.reply(':warning: | Due to Discord limitations, you need to delete more than 1 of my messages at once.');
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

			case "clrcom":
				const commandArray = ['/clear', '/ping', '/clrcom', '/help', '/say', '/sayin', '/exit', '/help', '/about', '/info', '/antispam', '/eval', '/sleep', '/vote', '/results', '/poll'];
				//Clear all command messages from users.
				if (functions.checkPermissions(message) && message.guild.member(bot.user).permissions.hasPermission("MANAGE_MESSAGES")){
					message.channel.fetchMessages({limit: 100}).then(function (m){
						filtered = m.filter(functions.findUserMessages.bind(this));
						try {
								if (filtered.size >=2 ){
									message.channel.bulkDelete(filtered);
									message.reply(' :white_check_mark: | I deleted ' + filtered.size + ' of commands from this channel.');
									removedMessages += filtered.size;
								} else {
									message.reply(':warning: | Due to Discord limitations, you need to delete more than 1 of my messages at once.');
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

			case "antispam":
				//Toggle anti-spam detection.
				if (functions.checkPermissions(message)){
					if (antiSpam === true){
						antiSpam = false;
						message.reply(':white_check_mark: | Bot Anti-spam is now toggled TO OFF.');
					} else {
						antiSpam = true;
						message.channel.sendMessage(':white_check_mark: | Bot Anti-spam is now toggled TO ON.');
					}
				}
				break;

			case "exit":
				//Exit the bot process.
				if (functions.checkPermissions(message)){
					console.log(Date() + ': Shuting down bot by /exit command.');
					bot.destroy().then(function(){
						process.exit(0);
					});
				} else {
					console.log('User (name: ' + message.author.username + ' | ID: ' + message.author.id  + ') tried to shutdown the bot and was denied.');
				}
				break;

			case "help":
				
				message.author.sendMessage('**Command List for WaveBot**\n'+
					`\`\`\`/ping - Pings WaveBot. Useful for checking on Bot.
/say <content> - Makes WaveBot type <content> into the text channel the command was ran
/about - Prints information about WaveBot
/info - Prints statistics about WaveBot
/vote <option> - Vote for <option> when a poll is active
/results - Used to view results of a poll when a poll is active

----- Admin Commands ----- 

/sayin <content> <delay in minutes> - WaveBot will announce <content> after <delay in minutes> in the channel the command was ran
/clrcom - Clear all command massages related to WaveBot from users in the channel this command was ran
/clear - Clear all WaveBot output from the channel this command was ran
/antispam - Toggle the automated removal of bot messages from unwanted channels
/poll <question/options/default/start/end> [options...] - Used to host a poll
/eval <javascript code> - Used to run arbitary Javascript Code. USE WITH CAUTION!
/exit - Exits WaveBot\`\`\``);
				break;
				
			case "about":
				//Prints the about me to a user's DM.
				message.reply('Hi, \n' +
					'I am made by <@114721723894595589> :D\n' +
					"I am up for: " + (Math.round(bot.uptime / (1000 * 60 * 60))) + " hours, " + (Math.round(bot.uptime / (1000 * 60)) % 60) + " minutes, and " + (Math.round(bot.uptime / 1000) % 60) + " seconds.\n" +
					'Check out my source code here: https://github.com/Frozemint/WaveBot');
				break;

			
			case "info":
				//View bot stats
				message.reply(`Information on WaveBot:\n` + `\`\`\`Logged in as     : ${bot.user.username}
Discord uptime   : ${Math.floor(bot.uptime / (1000 * 60 * 60 * 24))} days ${Math.floor(bot.uptime / (1000 * 60 * 60))} hours ${Math.floor(bot.uptime / (1000 * 60))% 60} minutes ${Math.floor(bot.uptime / 1000) % 60} seconds
Process uptime   : ${Math.floor(process.uptime() / (60 * 60 * 24))} days ${Math.floor(process.uptime() / (60 * 60))} hours ${Math.floor(process.uptime() / 60)% 60} minutes ${Math.floor(process.uptime() % 60)} seconds
Messages tracked : ${messagesCount}
Removed messages : ${removedMessages}
Commands ran     : ${commandCount}\`\`\``);
				break;

			case "eval":
				// /eval runs arbitary javascript code.
				if (functions.checkPermissions(message)){
					try {
						let code = message.content.substring(commandText[0].length+1);

						message.channel.sendCode('xl', eval(code));
					} catch (err){
						message.channel.sendMessage('Encountered an error during eval: \n' + err);
					}
				} else {
					console.log('User (name: ' + message.author.username + ' | ID: ' + message.author.id  + ') tried to /eval and was denied.');
				}
				break;

			/* Poll code */

			case "poll":
				//Only admins can create polls and check if poll question exist
				if (!functions.checkPermissions(message)) {return;}
				if (!commandText[1]) {message.reply(' :warning: | Try /poll <question/options/default/start/end> [options...]'); return;}

				switch (commandText[1].toLowerCase()){
					case "question":
						let pollQuestion = message.content.substring(commandText[0].length+commandText[1].length+1);
						message.reply(':white_check_mark: | Poll question set to: ' + pollQuestion + '.');
						break;
					case "option":
					case "options":
						if (!commandText[3]){
							message.reply(':warning: | You need to specify at least 2 options.');
							return;
						} else if (universalSuffrage === true){
							message.reply(' :warning: | You cannot change options while poll is active!');
							return;
						}
						let options = commandText.slice(2, commandText.length);
						//optionArray.push('');
						message.reply(':white_check_mark: | Options of poll set to: ' + optionArray.join(' | '));
						break;
					case "defaults":
					case "default":
						optionArray = ['Yes', 'No'];
						let pollQuestion = 'Placeholder question';
						message.reply(':white_check_mark: | Default options and question loaded.');

					case "start":
						if (universalSuffrage === false && optionArray.length >= 2 && pollQuestion.length > 0){ //If there is no poll in progress
							message.reply(' :mega: | Started a poll on: ' + pollQuestion + '\nVote with /vote <' + optionArray.join(' | ') + '>!');
							let voters = [];
							universalSuffrage = true;
							let pollChannelID = message.channel.id;
						} else if (universalSuffrage === true){
							message.reply(':warning: | A poll is already in progress!');
						} else if (optionArray.length < 2){
							message.reply(' :warning: | You need to specify the options of the poll!');
						} else if (question.length === 0 ){
							message.reply(' :warning: | You need to specify the question of the poll!');
						}
						break;
					case "end":
						if (universalSuffrage === true){ //Check if polls is running before closing it.
							message.channel.sendMessage('Poll on: ' + pollQuestion + ' is now CLOSED!');
							resultString = `FINAL RESULTS ON: ${pollQuestion}\n`;
							for (i = 0; i < optionArray.length; i++){
							resultString += `\n•${optionArray[i]}:: ${functions.countUserVote(optionArray[i])} votes`;
							resultString += `\n•${optionArray[i]} Voters:: [${functions.countVoteIdentity(optionArray[i])}]`;
						}
							
							message.channel.sendCode('asciidoc', resultString);
							universalSuffrage = false;
						} else if (universalSuffrage === false){
							message.reply(':warning: | There is no poll currently running!');
						}
						break;
					default:
						message.reply('Try /poll <question/options/start/end> [option1] [option2] [option3]');
						return;
				}
				break; //break out of the giant command switch block.

			case "vote":
				if (universalSuffrage === false){ //Check if there is a poll in progress.
					message.reply('There are currently no polls in progress.');
					return;
				} else if (message.channel.id != pollChannelID){
					message.reply(' :no_entry_sign: | Please vote in the text channel where the poll is being hosted.');
					return;
				} else if (!commandText[1] || optionArray.indexOf(commandText[1])=== -1){
					//optionArray.toString().toLowerCase(); for case insensitivity.
					message.reply('Your options in this poll are: ' + optionArray.join(' | '));
					return;
				}

				if (functions.findUserVote(message.author.id) === false){ //Find uservote returns false if user ID does not match with those who already voted
					voters.push(commandText[1] + '|' + message.author.id + '|' + message.author.username);
					message.reply(' :white_check_mark: | Your vote has been recorded!\nDo /results for the latest results.');
				} else {
					message.reply(' :no_entry_sign: | You have already voted once!');
					return;
				}
				break;

			case "result":
			case "results":
				if (universalSuffrage === false){
					message.reply(':warning: | There are currently no polls in progress.');
					return;
				}

				resultString = `VOTING RESULTS ON: ${pollQuestion}\n`;
				for (i = 0; i < options.length; i++){
					resultString += `\n•${options[i]}:: ${functions.countUserVote(options[i])} votes`;
					resultString += `\n•${options[i]} Voters:: [${functions.countVoteIdentity(options[i])}]`;
				}
				
				message.channel.sendCode('asciidoc', resultString);
				break;

			default:
				//This section will run if we run all the comparing above and 
				//none was found; i.e the user probably typed an non existent command.
				message.channel.sendMessage('Command not found. Try running /help.');
				break;
		}

	}
});