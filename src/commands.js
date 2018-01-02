var configFile = require('../config/config.json');
let votingJson = {};

const commands = {
	'ping': (msg) => {
		return msg.channel.send('*waves back*');
	},
	'invite': (msg) =>{
		return msg.channel.send(':thumbsup::skin-tone-3:  Invite link for WaveBot: <https://discordapp.com/api/oauth2/authorize?client_id=233380635777957890&scope=bot&permissions=0x00002000>');
	},
	'exit': (msg)=>{
		if (checkPermissions(msg)) process.exit(0);
	},
	'poll': (msg)=>{
		if (votingJson[msg.guild.id]) return msg.channel.send(':x: A poll is already underway!');
		let args = msg.content.substring(configFile.commandPrefix.length + 5, msg.content.length).split(";"); //what the fuck
		args = args.filter(function(item, index){ return args.indexOf(item) == index && String(item); });
		if (!checkPermissions(msg)) return;
		if (args.length < 3) return msg.channel.send(':x: Failed to start a poll. Make sure there is a question and at least two unique options.');
		votingJson[msg.guild.id] = {};
		votingJson[msg.guild.id].voters = [];
		votingJson[msg.guild.id].question = args[0];
		votingJson[msg.guild.id].options = args.slice(1, args.length).map(x => x.toLowerCase());
		votingJson[msg.guild.id].highestVote = 0;

		return msg.channel.send(':white_check_mark: Started a poll with question: `' + votingJson[msg.guild.id].question + '`\n:ballot_box: Options: `' + votingJson[msg.guild.id].options + '`');
	},
	'vote': (msg)=>{
		if (!votingJson[msg.guild.id]) return msg.channel.send(':x: There are no poll underway.');
		if (!msg.content.split(" ")[1] || votingJson[msg.guild.id].options.indexOf(msg.content.split(" ")[1].toLowerCase()) === -1) return msg.channel.send(':x: There is no such option in the poll.');

		if (!findVote(msg)){
			votingJson[msg.guild.id].voters.push(msg.content.split(" ")[1].toLowerCase() + '|' + msg.author.id + '|' + msg.author.username);
		} else {
			msg.delete();
			return msg.reply('You have already voted once!');
		}
		msg.delete();
		return msg.reply('Your vote has been recorded!');
	},
	'results': (msg)=>{
		if (!votingJson[msg.guild.id]) return msg.channel.send(':x: There are no poll underway.');
		let resultString = `---== VOTING RESULTS ON: ${votingJson[msg.guild.id].question} ==---\n\n`;

		for (i = 0; i < votingJson[msg.guild.id].options.length; i++){
			resultString += `${votingJson[msg.guild.id].options[i]} :: ${countOptionVote(votingJson[msg.guild.id].options[i], msg)}\n`;
		}
		return msg.channel.send(resultString, {code: 'diff'});
	},
	'endpoll': (msg)=>{
		if (!votingJson[msg.guild.id]) return msg.channel.send(':x: There are no poll underway.');
		let resultString = `---== FINAL VOTING RESULTS ON: ${votingJson[msg.guild.id].question} ==---\n\n`;

		for (i = 0; i < votingJson[msg.guild.id].options.length; i++){
			resultString += `${votingJson[msg.guild.id].options[i]} :: ${countOptionVote(votingJson[msg.guild.id].options[i], msg)}\n`;
		}
		console.log(votingJson[msg.guild.id]);
		delete votingJson[msg.guild.id];
		return msg.channel.send(resultString, {code: 'diff'});
	},
	'clear': (msg)=>{
		if (checkPermissions(msg)) {
			msg.channel.fetchMessages({limit: 100}).then(m =>{
				msg.channel.bulkDelete(m.filter( (msg) =>{ return (msg.author.id == 233380635777957890 || msg.content.startsWith(configFile.commandPrefix));} ))
				.catch(err => msg.channel.send(' :warning: Error while deleting messages: ' + err))
				.then(msg.channel.send('Finished clearing channel of WaveBot messages!'));
			});
		}
	}

}

function findVote(msg){
	for (let i = 0; i < votingJson[msg.guild.id].voters.length; i++){
		if (votingJson[msg.guild.id].voters[i].split('|')[1] === msg.author.id) return true;
	}
	return false;
}

function countOptionVote (option, msg){
	let total = 0;
	for (let i = 0; i < votingJson[msg.guild.id].voters.length; i++){
		if (votingJson[msg.guild.id].voters[i].split('|')[0] === option) total++;
	}
	return total + ' votes';
}

function checkPermissions(msg){
	return (msg.member.roles.find('name', 'Bot Commander') || msg.author.id === '114721723894595589' || msg.member.hasPermission('ADMINISTRATOR'));
}

exports.commands = commands;