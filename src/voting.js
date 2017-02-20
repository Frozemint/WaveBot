
/* Variables for conducting polls */
const Discord = require('discord.js');
var universalSuffrage = false, pollChannelID = '', pollQuestion = "", votersArray = [], optionArray = [], highestVote = 0;
var resultString;

function setQuestion(question){
	pollQuestion = question;
	return ':white_check_mark: | Poll question set to: ' + pollQuestion;
}

function setOptions(array){
	if (2 > array.length){
		return ':x: | You need to specify at least 2 options.';
	} else if (universalSuffrage === true){
		return ':x: | You cannot change voting options while poll is running!';
	}
	optionArray = array.slice(2, array.length);
	return ':white_check_mark: | Options of poll set to: ' + optionArray.join(' | ');
}

function setDefaults(channelID){
	pollQuestion = 'Default Question', optionArray = ['Yes', 'No'];
	startPoll(channelID);
	return ':white_check_mark: | Defaults for poll loaded and started.';
}

function startPoll(channelID){
	if (universalSuffrage === false && optionArray.length >= 2 && pollQuestion.length > 0){
		votersArray = [], pollChannelID = channelID, universalSuffrage = true;
	} else if (universalSuffrage === true){
		return ':x: | A poll is already running!';
	} else if (optionArray < 2){
		return ':x: | You need to specify the options for the poll.';
	} else if (pollQuestion === ""){
		return (':x: | You need to specify the question for the poll.');
	}
	return ':mega: | Started a poll on: ' + pollQuestion + '\n Vote with /vote <' + optionArray.join(' | ')+ '>!';
}

function highlightOption(votes){
	if (votes >= highestVote && highestVote != 0) {return "-";}
	return "+";
}

function endPoll(){
	if (universalSuffrage === false){
		return 'There is no poll currently running!';
	}
	if (universalSuffrage === true){ //Check if polls is running before closing it.
		resultString = `--- FINAL VOTING RESULTS ON: ${pollQuestion} ---\n\n`;

		//Find out highest voted option
		for (i = 0; i < optionArray.length; i++){
			if (countUserVote(optionArray[i]) >= highestVote && highestVote > 0){
				highestVote = countUserVote(optionArray[i]);
			}
		}

		for (i = 0; i < optionArray.length; i++){
			resultString += `\n${highlightOption(countUserVote(optionArray[i]))} ${optionArray[i]}:: ${countUserVote(optionArray[i])} votes [${countVoteIdentity(optionArray[i])}]`;
		}

		universalSuffrage = false;
	} 
	return resultString;
}

function findUserVote (userID){
	for (let i = 0; i < votersArray.length; i++){
		let value = votersArray[i].split('|');
		if (value[1] === userID){
			return true;
		}
	}
	return false;
}

function countUserVote (option){
	let totalVoters = 0;
	for (let i = 0; i < votersArray.length; i++){
		let value = votersArray[i].split('|');
		if (value[0] === option){
			totalVoters++;
		}
	}
	return totalVoters;
}

function countVoteIdentity (option){
	let votersIdentity = [];
	for (let i = 0; i < votersArray.length; i++){
		let value = votersArray[i].split('|'); //Split votersArray into an array, each holding option|voterID|voterUserName 
		if (value[0] === option){
			votersIdentity.push(value[2]);
		}
	}
	return votersIdentity.join(', ');
}

function printResults(){
	if (universalSuffrage === false){ return 'There are currently no polls in progress.';}

	resultString = `---== VOTING RESULTS ON: ${pollQuestion} ==---\n\n`;

	for (i = 0; i < optionArray.length; i++){
		resultString += `\n${highlightOption(countUserVote(optionArray[i]))} ${optionArray[i]}:: ${countUserVote(optionArray[i])} votes [${countVoteIdentity(optionArray[i])}]`;
	}
	return resultString;
}

function printRawResults(){
	return votersArray.join(', \n');
}

function castVote(channelID, option, userID, username){
	if (universalSuffrage === false){ return ':x:| There are currently no polls in progress!';}
	if (channelID != pollChannelID) { return ' :no_entry_sign: | Please vote in the channel where the poll is hosted.';}
	if (!option || optionArray.indexOf(option) === -1) { return ':negative_squared_cross_mark: | Your options for voting are: ' + optionArray.join(' | ');}

	if (findUserVote(userID) === false){
		votersArray.push(option + '|' + userID + '|' + username);
		for (i = 0; i < optionArray.length; i++){
			if (countUserVote(option) >= highestVote){
				highestVote = countUserVote(option);
			}
		}
		return ':white_check_mark: | ' + username + ', your vote has been recorded!\nDo /results for the latest results!';
	} else {
		return ':no_entry_sign: | You have already voted once!';
	}
}


module.exports = {
	findUserVote: findUserVote,
	countUserVote: countUserVote,
	countVoteIdentity: countVoteIdentity,
	setQuestion: setQuestion,
	setOptions: setOptions,
	printResults: printResults,
	setDefaults: setDefaults,
	startPoll: startPoll,
	castVote: castVote,
	endPoll: endPoll,
	optionArray: optionArray,
	pollQuestion: pollQuestion,
	printRawResults: printRawResults
}