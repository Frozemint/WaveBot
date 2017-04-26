const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config.json');

function changeBotPrefix(message, newPrefix){
  config.commandPrefix = newPrefix;
  fs.writeFile(path.join(__dirname, '../config.json'), JSON.stringify(config, null, 2), (err)=>{
		if (err) {message.channel.sendMessage("Error occured while writing command to file!"); return console.log(err);}
		console.log('Wrote new bot prefix to file.');
    message.channel.sendMessage("Successfully changed settings. Bot command prefix is now `" + newPrefix + "``.");
    console.log('Successfully changed settings.');
	});
}

function addBotChannel(message, channelID){
  config.botChannel.push(channelID);
  fs.writeFile(path.join(__dirname, '../config.json'), JSON.stringify(config, null, 2), (err)=>{
		if (err) {message.channel.sendMessage("Error occured while writing command to file!"); return console.log(err);}
		console.log('Wrote new bot only channel to file.');
    message.channel.sendMessage("Successfully changed settings. Whitelisted bot only channels are now ```" + config.botChannel + "```");
    console.log('Successfully changed settings.');
	});
}

function addBotServer(message, serverID){
  config.checkServers.push(serverID);
  fs.writeFile(path.join(__dirname, '../config.json'), JSON.stringify(config, null, 2), (err)=>{
		if (err) {message.channel.sendMessage("Error occured while writing command to file!"); return console.log(err);}
		console.log('Wrote new server to watch to file.');
    message.channel.sendMessage("Successfully changed settings. Bot will now monitor messages from other bots in the follow servers: ```" + config.checkServers + "```");
    console.log('Successfully changed settings.');
	});
}

function removeBotChannel(message, channelID){
  var index = config.botChannel.indexOf(channelID);
  if (index > -1){
    config.botChannel.splice(index, 1);
  } else {
    message.channel.sendMessage("No such channel ID exist in the list of currently whitelisted channel.");
    return;
  }
  fs.writeFile(path.join(__dirname, '../config.json'), JSON.stringify(config, null, 2), (err)=>{
		if (err) {message.channel.sendMessage("Error occured while writing command to file!"); console.log(err); return;}
		console.log('Successfully removed bot only channel from file.');
    message.channel.sendMessage("Successfully changed settings. Whitelisted bot only channels are now ```" + config.botChannel + "```");
    console.log('Successfully changed settings.');
	});
}

function removeBotServer(message, serverID){
  var index = config.botChannel.indexOf(serverID);
  if (index > -1){
    config.botChannel.splice(index, 1);
  } else {
    message.channel.sendMessage("No such server ID exist in the list of currently monitored servers.");
    return;
  }
  fs.writeFile(path.join(__dirname, '../config.json'), JSON.stringify(config, null, 2), (err)=>{
		if (err) {message.channel.sendMessage("Error occured while writing command to file!"); console.log(err); return;}
		console.log('Successfully removed server to watch from file.');
    message.channel.sendMessage("Successfully changed settings. Monitored servers channels are now ```" + config.checkServers + "```");
    console.log('Successfully changed settings.');
	});
}

module.exports = {
  changeBotPrefix: changeBotPrefix,
  addBotChannel: addBotChannel,
  removeBotChannel: removeBotChannel
}
