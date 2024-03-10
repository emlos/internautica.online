const fs = require("fs");
const path = require("path");

const arguments = process.argv; // [node, parser.js, [operator: parse, make], <fromfile>, <tofile>]
const destination = arguments[2];

const chaptersDataFile = join("chapter.test.js");
const gameDataFile = join("gamedata.test.js");

const outputFolder = join(destination);

const scriptsPath = join("", "../projects/dddsim/scripts/");

const scripts = fs
	.readdirSync(scriptsPath)
	.filter((script) => script.endsWith(".script"));

//read scripts
scripts.forEach((script) => {
	const scriptContent = fs
		.readFileSync(path.join(scriptsPath, script))
		.toString();

	parse(scriptContent);
});

function save(parser, script, outputDir) {
	fs.writeFileSync("myParser.js", parser.parse);
}

function join(
	filepath = "",

	data = "../src/_data/projects/dddsim/",
	dirname = __dirname
) {
	return path.join(dirname, data, filepath);
}

//-------------------------------------------------------------------------------

function parse(text) {
	//variables inside script, scene names, characters
	const references = {};

	//all lines sanitized
	const lines = init(text);

	console.log(lines);

	function init(text) {
		//normalize text

		"".toLowerCase;
		text = removeComments(text);
		const lines = text
			.split("\n")
			.filter((line) => line)
			.map((line, index) => {
				return {
					id: index,
					indent: getIndent(line),
					text: isDialogue(line) ? line.toLowerCase().trim() : line.trim(),
				};
			})
			.filter((line) => !/^\s*$/.test(line));
		//.map((line) => {});

		//make global objects:  Narrator, player, source folder

		references["source"] = "/images/projects/dddsim/";

		return lines;
	}

	function getIndent(line) {
		const indents = line.match(/^(\s*)/); // Matches leading spaces
		return indents ? indents[0].length : 0;
	}

	function getBlocks(lines) {
		/*
        {
            parent: {}
            ref: ""
            children: []
        }
        */
		const blocks = [];

		let currentDepth = lines[0].indent;

		lines.forEach((line) => {});
	}

	function removeComments(text) {
		//1.remove block commoents. 2. remove trailing spaces, 3. remove line comments

		const rawtext = text
			.replace(/###.*?###/gs, "")
			.replace(/#.*(?=\n)/g, "")
			.replace(/\s+$/g, " ");
		return rawtext;
	}
}

function isDialogue(line) {
	return false;
}

function isAttribute(line) {
	return false;
}

function isBlockStart(line) {
	return false;
}

function compileError(type, errorLine, causingLine, expectedPattern) {
	const messages = [`Error when compiling on line: ${errorLine}`];
	//types: match, invalidCharacters, redeclarationScene, redeclarationChapter, ,
	switch (type) {
		case "match":
			messages.push(`Unrecognized pattern for`, `"${causingLine}"`);

			break;

		default:
			break;
	}

	messages.push("Breaking...");

	throw new Error(messages.join("\n"));
}

// Function to parse the custom text format
function parseTextToJSON(text) {
	const lines = text.split("\n");

	const main = {};

	getBlocks(lines).forEach((block) => {});

	const Characters = {};
	let currentCharacter = null;
	let currentProperty = null;

	lines.forEach((line) => {
		line = line.split("#")[0].trim(); // Remove comments and trim whitespace

		if (line.startsWith("Character")) {
			const characterName = line.match(/\[([^\]]+)\]/)[1];
			currentCharacter = characterName;
			Characters[currentCharacter] = {};
		} else if (line.includes("is")) {
			const [property, value] = line
				.split("is")
				.map((s) => s.trim().replace(/\[|\]/g, ""));
			if (property === "sprites") {
				currentProperty = "sprites";
				Characters[currentCharacter][currentProperty] = {};
			} else if (currentProperty === "sprites") {
				const spriteNames = value.split(",").map((s) => s.trim());
				spriteNames.forEach((sprite) => {
					Characters[currentCharacter][currentProperty][
						sprite
					] = `${Characters[currentCharacter].name}/${sprite}.png`;
				});
				currentProperty = null; // Reset after parsing sprites
			} else {
				Characters[currentCharacter][property] = isNaN(Number(value))
					? value
					: Number(value);
			}
		}
	});

	return Characters;
}
