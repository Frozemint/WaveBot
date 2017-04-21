const bot = require('./bot.js');
const fs = require('fs');
const path = require('path');

const responseArray = require('../src/customcommands.json');


function readJokeCommand(message){
	//message is just commandtext minus the command prefix
	if(responseArray[message[0]]){
		console.log(Date() + ': Found a match in defined custom commands.');
		return responseArray[message];
	}
	switch(message[0].toLowerCase()){
		case "meme":
			var memeVictim = message[1];
			return '<@!226535465149267978>, ' + memeVictim + ' wants to be memed!';
			break;
		default:
			break;
	}
}

function addCustomCommand(message, command, response){
	//where message is the discord message object, command is the /[trigger word], and response is
	//the bot output when /[trigger word] is typed.
	responseArray[command] = response;
	fs.writeFile(path.join(__dirname, '../src/customcommands.json'), JSON.stringify(responseArray, null, 2), (err)=>{
		if (err) {message.channel.sendMessage("Error occured while writing command to file!"); return console.log(err);}
		console.log('Wrote to file.');
	});
	return 'Added command to array.';
}

function removeCustomCommand(command){
	if (responseArray[command]){
		delete responseArray[command];
		fs.writeFile(path.join(__dirname, '../src/customcommands.json'), JSON.stringify(responseArray, null, 2), function(err){
		if (err) return console.log(err);
		console.log('Writing to file.');
	});
		return 'Removed command from array.';
	} else {
		return 'No match found; nothing to delete.';
	}
}

module.exports = {
	responseArray: responseArray,
	readJokeCommand: readJokeCommand,
	addCustomCommand: addCustomCommand,
	removeCustomCommand: removeCustomCommand
}
