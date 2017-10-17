function checkPermissions(message){
	if (message.member.roles.find('name', 'Bot Commander') || message.author.id === '114721723894595589' || message.member.hasPermission('ADMINISTRATOR')) {
		//Check if use has role "Bot Commander" tagged or if writer of bot is trying ot run command.
		console.log(Date() + ': User ' + message.author.tag + ' is admin, running command.');
		return true;
	} else {
		//Log the incident if it's not an authorised user.
		console.log('User ' + message.author.tag + ' just attempted to run a admin only command and was denied.');
		message.channel.send(':no_entry_sign: | You do not have permission to execute the said command, this incident will be reported.');
		return false;
	}
}

module.exports = {
	checkPermissions: checkPermissions
}