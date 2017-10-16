const { Client } = require('discord.js');
const tokens = require('./tokens.json'); //file for Discord Bot token.
const client = new Client();

client.on('ready', () => {
	console.log('Ready.');
})

client.on('message', () =>{
	console.log('');
})