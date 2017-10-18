const startFile = require('./start.js');
const fs = require('fs');

function readUserOrders(message){
	// message has the following format: /commands <add/remove> <command to add> <output>
	var args = message.content.split(" ");
	if (args[1] === "add"){
		addCustomCommand(message);
	} else if (args[1] === "remove"){
		removeCustomCommand(message);
	}
}

function readCustomCommands(message){
	var commandArray = require('./customCommands.json');
	var args = message.content.split(" ");
	args[0] = args[0].substring(1, args[0].length);
	if(commandArray[args[0]]){
		console.log(Date() + ": Found a match in defined custom commands.");
		message.channel.send(commandArray[args]);
	}
}

function addCustomCommand(message){
	var commandArray = require('./customCommands.json');
	// message has the following format: /command add <command to add> <output>
	var args = message.content.split(" ");
	var commandToAdd = args[2];
	var outputToAdd = message.content.substring(args[0].length + args[1].length + args[2].length + 2);
	if (!commandToAdd || !outputToAdd) { message.channel.send(":information_source: | /command add <command to add> <output>"); return;}
	commandArray[commandToAdd] = outputToAdd;
	fs.writeFile('./customCommands.json', JSON.stringify(commandArray, null, 2), (err)=>{
		if (err) {message.channel.send(":warning: | Error occured while saving custom command: " + err); return;}

		console.log(Date() + ": Successfully saved new custom command to file.");
		message.channel.send(":white_check_mark: | Successfully saved custom command.");
	});
}

function removeCustomCommand(message){
	var commandArray = require('./customCommands.json');
	var args = message.content.split(" ");
	if(commandArray[args[2]]){
		delete commandArray[args[2]];
		fs.writeFile('./customCommands.json', JSON.stringify(commandArray, null, 2), (err)=>{
		if (err) {message.channel.send(":warning: | Error occured while deleting custom command: " + err); return;}

		console.log(Date() + ": Successfully deleted custom command to file.");
		message.channel.send(":white_check_mark: | Successfully deleted custom command.");
	});
	} else {
		message.channel.send(":negative_squared_cross_mark: | No match found; nothing to delete.");
	}
}

module.exports = {
	readCustomCommands: readCustomCommands,
	addCustomCommand: addCustomCommand,
	removeCustomCommand: removeCustomCommand,
	readUserOrders: readUserOrders
}