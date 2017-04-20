
/* Variables for conducting polls */
const Discord = require('discord.js');
var resultString;
var votingJson = new Object();

function createServerObject(serverID){
	if (!votingJson[serverID]){
		votingJson[serverID] = new Object();
		console.log(votingJson);
	}
}

function setQuestion(question, serverID){
	votingJson[serverID].question = question;
	return ':white_check_mark: | Poll question set to: ' + votingJson[serverID].question;
	console.log(votingJson);
}

function setOptions(array, serverID){
	if (2 > array.length){
		return ':x: | You need to specify at least 2 options.';
	} else if (votingJson[serverID].universalSuffrage === true){
		return ':x: | You cannot change voting options while poll is running!';
	}

	optionArray = array.slice(2, array.length);
	//Filter options in the array to get rid of empty elements and Make
	//every element in the array unique.
	optionArray = optionArray.filter(function(n, position) {return n && optionArray.indexOf(n) === position});
	votingJson[serverID].optionArray = optionArray;
	console.log(votingJson);
	return ':white_check_mark: | Options of poll set to: ' + optionArray.join(' | ');
}

function setDefaults(channelID, serverID){
	votingJson[serverID].question = 'Default Question', votingJson[serverID].optionArray = ['Yes', 'No'];
	startPoll(channelID, serverID);
	return ':white_check_mark: | Defaults for poll loaded and started.';
}

function startPoll(channelID, serverID){
	if (votingJson[serverID].universalSuffrage != true && votingJson[serverID].optionArray.length >= 2 && votingJson[serverID].question.length > 0){
		votingJson[serverID].universalSuffrage = true;
	} else if (votingJson[serverID].universalSuffrage === true){
		return ':x: | A poll is already running!';
	} else if (votingJson[serverID].optionArray < 2){
		return ':x: | You need to specify the options for the poll.';
	} else if (votingJson[serverID].question.length > 0){
		return (':x: | You need to specify the question for the poll.');
	}
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
	if (votingJson[serverID].universalSuffrage === false){ return 'There is no poll currently running!';}
	if (votingJson[serverID].universalSuffrage === true){ //Check if polls is running before closing it.
		resultString = `--- FINAL VOTING RESULTS ON: ${votingJson[serverID].question} ---\n\n`;

		//Find out highest voted option
		for (i = 0; i < votingJson[serverID].optionArray.length; i++){
			if (countUserVote(votingJson[serverID].optionArray[i], serverID) >= votingJson[serverID].highestVote && votingJson[serverID].highestVote > 0){
				votingJson[serverID].highestVote = countUserVote(votingJson[serverID].optionArray[i], serverID);
			}
		}

		for (i = 0; i < votingJson[serverID].optionArray.length; i++){
			resultString += `\n${highlightOption(countUserVote(votingJson[serverID].optionArray[i], serverID), serverID)} ${votingJson[serverID].optionArray[i]}:: ${countUserVote(votingJson[serverID].optionArray[i], serverID)} votes [${countVoteIdentity(votingJson[serverID].optionArray[i], serverID)}]`;
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

	resultString = `---== VOTING RESULTS ON: ${votingJson[serverID].question} ==---\n\n`;

	for (i = 0; i < votingJson[serverID].optionArray.length; i++){
		resultString += `\n${highlightOption(countUserVote(votingJson[serverID].optionArray[i], serverID), serverID)} ${votingJson[serverID].optionArray[i]}:: ${countUserVote(votingJson[serverID].optionArray[i], serverID)} votes [${countVoteIdentity(votingJson[serverID].optionArray[i], serverID)}]`;
	}
	return resultString;
}

function printRawResults(serverID){
	return JSON.stringify(votingJson[serverID], null, 2);
}

function castVote(serverID, option, userID, username){
	if (votingJson[serverID].universalSuffrage === false){ return ':x:| There are currently no polls in progress!';}
	if (!option || votingJson[serverID].optionArray.indexOf(option) === -1) { return ':negative_squared_cross_mark: | Your options for voting are: ' + votingJson[serverID].optionArray.join(' | ');}

	if (findUserVote(userID, serverID) === false){
		votingJson[serverID].votersArray.push(option + '|' + userID + '|' + username);
		for (i = 0; i < votingJson[serverID].optionArray.length; i++){
			if (countUserVote(option, serverID) >= votingJson[serverID].highestVote){
				votingJson[serverID].highestVote = countUserVote(option, serverID);
			}
		}
		return ':white_check_mark: | ' + username + ', your vote has been recorded!\nDo /results for the latest results!';
	} else {
		return ':no_entry_sign: | You have already voted once!';
	}
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
	printRawResults: printRawResults
}
