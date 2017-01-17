const bot = require('./bot.js');
const fs = require('fs');

var responseArray = require('./customcommands.json');


function readJokeCommand(message){
	if(responseArray[message]){
		console.log(Date() + ': Found a match in defined custom commands.');
		return responseArray[message];
	}
}

function addCustomCommand(command, response){
	responseArray[command] = response;
	console.log('ResponseArray is now ' + JSON.stringify(responseArray));
	fs.writeFile('customcommands.json', JSON.stringify(responseArray), function(err){
		if (err) return console.log(err);
		console.log('Writing to file.');
	});
	return 'Added command to array.';
}

function removeCustomCommand(command){
	if (responseArray[command]){
		delete responseArray[command];
		console.log('ResponseArray is now ' + JSON.stringify(responseArray));
		fs.writeFile('customcommands.json', JSON.stringify(responseArray), function(err){
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