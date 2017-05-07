
/* Variables for conducting polls */
const Discord = require('discord.js');
var resultString;
var votingJson = new Object();

function createServerObject(serverID){
	if (!votingJson[serverID]){
		votingJson[serverID] = new Object();
		votingJson[serverID].secretBallot = false;
	}
}

function setQuestion(question, serverID){
	if (question.length === 0) {return ':x: | Please type an poll question.';}
	votingJson[serverID].question = question;
	return ':white_check_mark: | Poll question set to: ' + votingJson[serverID].question;
}

function setOptions(array, serverID){

	if (votingJson[serverID].universalSuffrage === true){
		return ':x: | You cannot change voting options while poll is running!';
	}

	//Since we are sent the entire message including command texts, we
	//filter out stuff to only leave /poll option arguments
	optionArray = array.slice(2, array.length);
	//Filter options in the array to get rid of empty elements and Make
	//every element in the array unique.
	optionArray = optionArray.filter(function(n, position) {return n && optionArray.indexOf(n) === position});
	if (2 > optionArray.length) { return ' :x: | Please make sure you specify at least 2 UNIQUE options.';}
	votingJson[serverID].optionArray = optionArray;
	return ':white_check_mark: | Options of poll set to: ' + optionArray.join(' | ');
}

function setDefaults(channelID, serverID){
	votingJson[serverID].question = 'Default Question', votingJson[serverID].optionArray = ['Yes', 'No'];
	startPoll(channelID, serverID);
	return ':white_check_mark: | Defaults for poll loaded and started.';
}

function startPoll(channelID, serverID){
	if (!votingJson[serverID]) { return ':x: | Please ensure that you have the question and the options for the poll properly setup.';}
	if (!votingJson[serverID].question || 0 > votingJson[serverID].question.length) { return ':x: | Please ensure you have a question set.';}
	if (!votingJson[serverID].optionArray || 2 > votingJson[serverID].optionArray.length) { return ':x: | Please ensure you have the option of the poll properly setup.';}

	if (!votingJson[serverID].secretBallot) { votingJson[serverID].secretBallot = false;}

	votingJson[serverID].universalSuffrage = true;
	//Init a voters array in json
	votingJson[serverID].votersArray = [];
	//init a highest vote array in json
	votingJson[serverID].highestVote = 0;
	//Question is set in another function, commented code here for consistency
	//votingJson[serverID].question = question;
	return ':mega: | Started a poll on: ' + votingJson[serverID].question + '\n Vote with /vote <' + votingJson[serverID].optionArray.join(' | ')+ '>!';
}

function highlightOption(votes, serverID){
	if (votes >= votingJson[serverID].highestVote && votingJson[serverID].highestVote != 0) {return "-";}
	return "+";
}

function endPoll(serverID){
	if (!votingJson[serverID] || votingJson[serverID].universalSuffrage != true){ return 'There is no poll currently running on this server!';}
	if (votingJson[serverID].universalSuffrage === true){ //Check if polls is running before closing it.
		resultString = `--- FINAL VOTING RESULTS ON: ${votingJson[serverID].question} ---\n\n`;

		//Find out highest voted option
		for (i = 0; i < votingJson[serverID].optionArray.length; i++){
			if (countUserVote(votingJson[serverID].optionArray[i], serverID) >= votingJson[serverID].highestVote && votingJson[serverID].highestVote > 0){
				votingJson[serverID].highestVote = countUserVote(votingJson[serverID].optionArray[i], serverID);
			}
		}

		for (i = 0; i < votingJson[serverID].optionArray.length; i++){
			if (votingJson[serverID].secretBallot){
				resultString += `\n${highlightOption(countUserVote(votingJson[serverID].optionArray[i], serverID), serverID)} ${votingJson[serverID].optionArray[i]}:: ${countUserVote(votingJson[serverID].optionArray[i], serverID)} votes`;
			} else {
				resultString += `\n${highlightOption(countUserVote(votingJson[serverID].optionArray[i], serverID), serverID)} ${votingJson[serverID].optionArray[i]}:: ${countUserVote(votingJson[serverID].optionArray[i], serverID)} votes [${countVoteIdentity(votingJson[serverID].optionArray[i], serverID)}]`;
			}
		}

		votingJson[serverID].universalSuffrage = false;
	}
	return resultString;
}

function findUserVote (userID, serverID){
	for (let i = 0; i < votingJson[serverID].votersArray.length; i++){
		let value = votingJson[serverID].votersArray[i].split('|');
		if (value[1] === userID){
			return true;
		}
	}
	return false;
}

function countUserVote (option, serverID){
	//Count votes OF A PARTICULAR OPTION
	let totalVoters = 0;
	for (let i = 0; i < votingJson[serverID].votersArray.length; i++){
		let value = votingJson[serverID].votersArray[i].split('|');
		if (value[0] === option){
			totalVoters++;
		}
	}
	return totalVoters;
}

function countVoteIdentity (option, serverID){
	let votersIdentity = [];
	for (let i = 0; i < votingJson[serverID].votersArray.length; i++){
		let value = votingJson[serverID].votersArray[i].split('|'); //Split votersArray into an array, each holding option|voterID|voterUserName
		if (value[0] === option){
			votersIdentity.push(value[2]);
		}
	}
	return votersIdentity.join(', ');
}

function printResults(serverID){
	if (!votingJson[serverID] || votingJson[serverID].universalSuffrage != true){ return 'There are currently no polls in progress on this server.';}
	if (votingJson[serverID].secretBallot) {
		return 'As secret ballots are being used, results are only available when the poll close.';
	}
	resultString = `---== VOTING RESULTS ON: ${votingJson[serverID].question} ==---\n\n`;

	for (i = 0; i < votingJson[serverID].optionArray.length; i++){
			resultString += `\n${highlightOption(countUserVote(votingJson[serverID].optionArray[i], serverID), serverID)} ${votingJson[serverID].optionArray[i]}:: ${countUserVote(votingJson[serverID].optionArray[i], serverID)} votes [${countVoteIdentity(votingJson[serverID].optionArray[i], serverID)}]`;
	}
	return resultString;
}

function printRawResults(serverID){
	return JSON.stringify(votingJson[serverID], null, 2);
}

function castVote(message, serverID, option, userID, username){
	if (!votingJson[serverID] || votingJson[serverID].universalSuffrage != true){ return ':x:| There are currently no polls in progress!';}
	if (!option || votingJson[serverID].optionArray.indexOf(option) === -1) { return ':negative_squared_cross_mark: | Your options for voting are: ' + votingJson[serverID].optionArray.join(' | ');}

	if (findUserVote(userID, serverID) === false){ //If they haven't voted
		votingJson[serverID].votersArray.push(option + '|' + userID + '|' + username);
		for (i = 0; i < votingJson[serverID].optionArray.length; i++){
			if (countUserVote(option, serverID) >= votingJson[serverID].highestVote){
				votingJson[serverID].highestVote = countUserVote(option, serverID);
			}
		}
		if (votingJson[serverID].secretBallot) {
			message.delete();
			return ':white_check_mark: | ' + username + ', your vote has been recorded. Results will be available when the poll close.';
		}

		return ':white_check_mark: | ' + username + ', your vote has been recorded!\nDo /results for the latest results!';
	} else {
		return ':no_entry_sign: | You have already voted once!';
	}
}

function setSecret(serverID, setting){
	votingJson[serverID].secretBallot = !votingJson[serverID].secretBallot;
	return ':white_check_mark: | The use of secret ballot has been set to : ' + votingJson[serverID].secretBallot;
}


module.exports = {
	votingJson: votingJson,
	createServerObject: createServerObject,
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
	printRawResults: printRawResults,
	setSecret: setSecret
}
