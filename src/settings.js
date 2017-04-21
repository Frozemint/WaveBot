const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config.json');

function changeBotPrefix(message, newPrefix){
  config.commandPrefix = newPrefix;
  fs.writeFile(path.join(__dirname, '../config.json'), JSON.stringify(config, null, 2), (err)=>{
		if (err) {message.channel.sendMessage("Error occured while writing command to file!"); return console.log(err);}
		console.log('Wrote new bot prefix to file.');
    message.channel.sendMessage("Successfully changed settings. ");
    console.log('Successfully changed settings.');
	});
}

module.exports = {
  changeBotPrefix: changeBotPrefix
}
