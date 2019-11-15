var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var config = require('./config.json');
const fs = require('fs');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
	colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
	token: auth.token,
	autorun: true
});

bot.on('ready', function (evt) {
	logger.info('Connected');
	logger.info('Logged in as: ');
	logger.info(bot.username + ' - (' + bot.id + ')');
});

const bannedWords = ["rhombus", "adventure"];


bot.on('message', function (user, userID, channelID, message, evt) {
	//If the message is a command using the config prefix.
	if (message.substring(0, 1) == config.prefix) {
		var args = message.substring(1).split(' ');
		var cmd = args[0];
		
		let rawdata = fs.readFileSync('ocs.json');
		let ocs = JSON.parse(rawdata);

		args = args.splice(1);
		switch(cmd) {
		//Display a list of commands for the bot.
		case 'help':
			let helpText = "";
			helpText += "```====================================================================================\n";
			helpText += " =help                                 : Displays this menu.\n";
			helpText += " =info                                 : Displays bot information.\n";
			helpText += " =addChar (name)                       : Adds a RP character with name (name).\n";
			helpText += " =editChar (name) (field) (value)      : Edits a RP character's info.\n";
			helpText += "====================================================================================```";
			bot.sendMessage({
				to: channelID,
				message: helpText
			});
			logger.info("Displayed help for: " + user);
		break;
		//Display info about the bot.
		case 'info':
			bot.sendMessage({
				to: channelID,
				message: "```Name    | NullaBot\nAuthor  | Merthew\nVersion | 1.0.0```"
			});
			logger.info("Displayed info for: " + user);
		break;
		//Add Character to RP database.
		case 'addChar':
			if(ocs.hasOwnProperty(args[0])){
				bot.sendMessage({
					to: channelID,
					message: "```Character already exists.```"
				});
			}
			else {
				eval("ocs." + args[0] + " = \{\}");
				eval("ocs." + args[0] + ".author = \"" + user + "\"");
				let data = JSON.stringify(ocs);
				fs.writeFileSync('ocs.json', data);
				bot.sendMessage({
					to: channelID,
					message: "```Added Character: " + args[0] + " ```"
				});
			}
		break;
		//Edit Character in RP database.
		case 'editChar':
			if(ocs.hasOwnProperty(args[0])){
				switch(args[1]){
				//edit bio
				case 'bio':
					console.log("it said bio");
					var bio = args.splice(2);
					var temp = "";
					for(let i = 0; i < bio.length; ++i){
						temp += bio[i] + " ";
					}
					console.log(temp);
					eval("ocs." + args[0] + ".bio = \"" + temp + "\"");
					let data = JSON.stringify(ocs);
					fs.writeFileSync('ocs.json', data);
					break;
				}
			}
			else{
				bot.sendMessage({
					to: channelID,
					message: "```Character does not exist: " + args[0] + " ```"
				});
			}
		break;
		}
	}

	//Anything else done with messages.
	for(let i = 0; i < bannedWords.length; ++i){
		if(message.includes(bannedWords[i])){
			bot.sendMessage({
				to: channelID,
				message: "OYE!!! KEEP IT CHILL"
			});
		}
	}


});