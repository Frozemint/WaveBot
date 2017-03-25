const bot = require('./bot.js');
const fs = require('fs');

var responseArray = require('./customcommands.json');


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

function addCustomCommand(command, response){
	responseArray[command] = response;
	console.log('ResponseArray is now ' + JSON.stringify(responseArray));
	fs.writeFile('../src/customcommands.json', JSON.stringify(responseArray), function(err){
		if (err) return console.log(err);
		console.log('Writing to file.');
	});
	return 'Added command to array.';
}

function removeCustomCommand(command){
	if (responseArray[command]){
		delete responseArray[command];
		console.log('ResponseArray is now ' + JSON.stringify(responseArray));
		fs.writeFile('../src/customcommands.json', JSON.stringify(responseArray), function(err){
		if (err) return console.log(err);
		console.log('Writing to file.');
	});
		return 'Removed command from array.';
	} else {
		return 'No match found; nothing to delete.';
	}
}

module.exports = {
	readJokeCommand: readJokeCommand,
	addCustomCommand: addCustomCommand,
	removeCustomCommand: removeCustomCommand
}