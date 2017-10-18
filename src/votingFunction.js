
const Discord = require('discord.js');

var votingData = new Object(); //votingData holds all data related to voting in all servers

function createServerData(serverID){
	//This function create a field for a server if it doesn't already exist
	if(!votingJson){
		votingJson[serverID] = new Object();
		votingJson[serverID].secretBallot = false;
	}
}

function initialisePoll(message){
	//the message for setting up and starting a poll...
	//messages always have the structure /poll QUESTION;OPTIONA;OPTIONB;OPTIONC;...
	//There is no limit on the number of options

	var args = message.content.split(" ");
	args = args[1].split(";");

	console.log(args);
}