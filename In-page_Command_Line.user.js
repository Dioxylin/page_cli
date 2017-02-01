// ==UserScript==
// @name        In-page Command Line
// @namespace   example.com
// @include     https://www.reddit.com/*
// @version     1
// @grant       none
// ==/UserScript==

// Debug shit.

var DEBUG = true;

var debugLog = function(message) {
	if (DEBUG) {
		console.log(message);
	}
};

// Functions to enable command line functionality.

var unknownCommand = function(command) {
	commandLineOutput.value += "Unknown command: " + command + ".";
}

var redditOpen = function(args) {
	let ranks = document.querySelectorAll("span.rank");
	for (var i = 0; i < args.length; i ++) {
		let arg = args[i];
		debugLog("Argument: " + arg);
		if (arg.match(/\.\./) != null) {
			debugLog("Range arg!");
			let rangeArg = arg.split(/\.\./);
			debugLog("Range arg: " + rangeArg);
			for (var j = rangeArg[0]; j <= rangeArg[1]; j++) {
				let rank = ranks[j];
				let link = rank.parentElement.querySelector("div.entry.unvoted a").href;
				window.open(link);
			}
			continue;
		}
		if (arg < 1 || arg > 25) {
			commandLineOutput.value += "Rank " + arg + " out of bounds [1..25].";
			continue;
		}
		let rank = ranks[arg];
		let link = rank.parentElement.querySelector("div.entry.unvoted a").href;
		window.open(link);
		// #thing_t3_5rd3qi > div:nth-child(5) > p:nth-child(1) > a:nth-child(1)
		// rank.parentElement.querySelector("div.entry.unvoted a").href;
	}
}

var parse = function(commandLine) {
	let commandArray = commandLine.split(/\s+/);
	let command = commandArray[0];
	let args = commandArray.slice(1,commandArray.length);
	debugLog("Arglist: " + args);

	switch(command) {
		case "open":
			redditOpen(args);
			break;
		default:
			unknownCommand(command);
			break;
	}
}

var commandLineInputEvent = function(event) {
	try {
		if (event.keyCode === 13) {
			commandLineOutput.value += "> " + commandLineInput.value + "\n";
			parse(commandLineInput.value);
			commandLineInput.value = "";
		}
		else if (event.keyCode === 38) {
		}
		else if (event.keyCode === 40) {
		}
	}
	catch (ex) {
		console.log("ERROR: Caught exception: " + ex);
	}
};

// Page setup

var body = document.querySelector("body");
//var body = document.querySelector("html");

var commandLineDiv = document.createElement("div");
commandLineDiv.id = "commandLineDiv";
commandLineDiv.style.width = "95%";
commandLineDiv.style.height = "200px";
commandLineDiv.style.position = "fixed";
commandLineDiv.style.bottom = "0px";

var commandLineOutput = document.createElement("textarea");
commandLineOutput.id = "commandLineOutput";
commandLineOutput.readonly = true;
commandLineOutput.style.width = "95%";
commandLineOutput.style.height = "90%";
commandLineOutput.style.resize = "vertical";

commandLineDiv.appendChild(commandLineOutput);

var commandLineInput = document.createElement("input");
commandLineInput.onkeypress = commandLineInputEvent;
commandLineInput.id = "commandLineInput";
commandLineInput.style.width = "95%";
commandLineInput.style.height = "10%";

commandLineDiv.appendChild(commandLineInput);

var spacerDiv = document.createElement("div");
spacerDiv.id = "spacerDiv";
spacerDiv.style.width = "95%";
spacerDiv.style.height = "200px";

body.appendChild(commandLineDiv);
body.appendChild(spacerDiv);

// 38 arrow up
// 40 arrow down
// 13 enter
