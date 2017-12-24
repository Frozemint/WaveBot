var configFile = require('../config/config.json');

let votingJson = {};

const commands = {
	'ping': (msg) => {
		return msg.channel.send('*waves back*');
	},
	'invite': (msg) =>{
		return msg.channel.send('Invite link for WaveBot: https://discordapp.com/api/oauth2/authorize?client_id=233380635777957890&scope=bot&permissions=0x00002000');
	},
	'exit': (msg)=>{
		if (checkPermissions(msg)) process.exit(0);
	},
	'poll': (msg)=>{
		let args = msg.content.substring(configFile.commandPrefix.length + 5, msg.content.length).split(";"); //what the fuck
		args = args.filter(function(item, index){ return args.indexOf(item) == index && String(item); });
		if (!checkPermissions(msg)) return;
		if (args.length < 3) return msg.channel.send('Failed to start a poll. Make sure there is a question and at least two unique options.');
		/*
		if(!votingJson[msg.guild.id]){
			votingJson[msg.guild.id] = {};
		}*/
	}

}

function checkPermissions(msg){
	return (msg.member.roles.find('name', 'Bot Commander') || msg.author.id === '114721723894595589' || msg.member.hasPermission('ADMINISTRATOR'));
}

exports.commands = commands;