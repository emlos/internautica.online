/*
 *  const cheat sheet:
 *
 *  Story: {gameName, chapters: []}
 *  PlayerState: {name, flags, reputation: {}}
 *  Characters: {<Name>: {name, sprites: {<neutral, happy etc>: string}}}
 *  Bgs: {<Name>: string}
 *
 */

const Current = {
	chapter: Story.chapters[0], //while generating each chapter page fill this into the template via script
	scene: "some scene id",
	dialogue: 0, //which dialogues[n] index scene is at
	saveSlot: -1,
};

//html targets -------------
const html = {
	textbox: {},
	nametag: {}, //inside the talk-panel
	text: {}, //inside the talk-panel
	menu: {}, //inside the talk-panel
	nextbutton: {}, //inside the talk-panel
	optionsbutton: {}, //inside the talk-panel
	choices: {},
	characters: {},

	background: {}, // background IMAGE
	overlays: [],
};

// INIT----------------------------------

function init() {
	html.nametag = document.getElementById("nametag");
	html.textbox = document.getElementById("talk-panel");
	html.characters = document.getElementById("sprite-panel");
	html.choices = document.getElementById("choice-panel");
	html.text = document.getElementById("line");
	html.menu = document.getElementById("game-menu");
	html.nextbutton = document.getElementById("next-line-button");
	html.optionsbutton = document.getElementById("options-button");

	html.background = document.getElementById("background-panel");

	html.overlays = document.getElementById("overlay");

	//console.log(html);

	//loadMainMenu()

	//loadSaves()

	showTitle(Current.chapter.title);

	//start chapter
	registerButtonClick(function () {
		start(Current.chapter.start);
	});
}

function start(scene_id) {
	console.log("LOG: starting scene: " + scene_id);

	registerButtonClick(false);

	Current.scene = scene_id;
	Current.dialogue = 0;

	const scn = currentScene();
	const first = scn.dialogues[Current.dialogue];

	//console.log(scn);

	enableMenu();

	changeBackground(html.background, scn.background);

	//todo: other SCENE setup

	loadDialogue(first);

	//continue here
}

function showTitle(title) {
	hide(
		html.characters,
		html.choices,
		html.nametag,
		html.overlays,
		html.optionsbutton
	);

	show(html.textbox, html.nextbutton, html.background, html.menu);

	changeBackground(html.background); //turn bg to black

	disableMenu();

	setTextbox(title);
}

function loadDialogue(dialogue) {
	console.log(
		"LOG: Loading dialogues[" +
			Current.dialogue +
			"] in scene id: " +
			Current.scene
	);

	//console.log(dialogue)

	show(html.nextbutton, html.optionsbutton, html.menu);

	if (dialogueValid(dialogue.conditions)) {
		loadDialogueBackground(dialogue.background);

		loadDialogueCharacters(dialogue.characters, dialogue.speaking);

		loadDialogueText(dialogue.text[0]);

		loadDialogueChoices(dialogue.choices);

		handleDialogueGoto()
	} else {
		nextDialogue(); //load next dialogue next
	}
}

function dialogueValid(conditions) {
	if (!conditions) {
		console.log("LOG: dialogue has no flags!");
		return true;
	}
	console.log(userHasFlags(...conditions))
	return userHasFlags(...conditions);
}

function loadDialogueCharacters(characters, speaking) {
	setNametag(speaking);
	show(html.nametag, html.characters, html.background);

	hide(html.overlays);

	clear(html.characters);

	if (!characters) {
		return;
	}

	characters.forEach((char) => {
		let sprite = char.sprites.neutral;
		let cName = char.name;

		let character = document.createElement("div");
		character.classList.add("dddsim-sprite");
		if (cName === speaking) character.classList.add("talking");
		changeBackground(character, sprite);

		html.characters.appendChild(character);
	});
}

function loadDialogueBackground(background) {
	if (background) {
		changeBackground(html.background, dialogue.background);
	} else {
		console.log("LOG: dialogue has no background!");

		const scn = currentScene(); //use scene background
		changeBackground(html.background, scn.background);
	}
}

function loadDialogueText(text) {
	show(html.menu);
	show(html.textbox);
	show(html.nametag);

	setTextbox(text);
}

function loadDialogueChoices(choices) {
	clear(html.choices); //remove all choice buttons

	if (choices) {
		removeTalkingSprites();

		show(html.overlays, html.choices);

		hide(html.nextbutton);

		choices.forEach((choice) => {
			let btn = document.createElement("button");

			btn.classList.add("dddsim-choice-button", "panel", "enabled");
			btn.id = "button-choice-" + choice.id;
			btn.innerHTML = choice.text;

			choiceSetsFlags(choice, btn);
			choiceRedirects(choice, btn);

			html.choices.appendChild(btn);
		});
	} else {
		console.log("LOG: dialogue has no choices!");

		hide(html.overlays, html.choices);
		show(html.nextbutton);
	}
}

function handleDialogueGoto(scene_id) {
	if (scene_id) {
		hide(html.choices);
		show(html.nextbutton);
		registerButtonClick(function () {
			nextScene(scene_id);
		});
	} else {
		console.log("LOG: dialogue has no goto; goto is next dialogue!");
		registerButtonClick(function () {
			nextDialogue();
		});
	}
}



function choiceSetsFlags(choice, button) {
	if (choice.flags) {
		console.log("LOG: setting flags on choice " + choice.id);

		register(button, function () {
			setUserFlags(choice.flags);
		});
	} else {
		console.log("LOG: choice " + choice.id + " has no Flags!");
	}
}

function choiceRedirects(choice, button) {
	if (choice.goto) {
		console.log("LOG: setting goto on choice " + choice.id);

		register(button, function () {
			nextScene(choice.goto);
		});
	} else {
		console.log(
			"LOG: choice " + choice.id + " has no goto; goto is next dialogue."
		);
		register(button, function () {
			nextDialogue();
		});
	}
}

// STORY FLOW-------------- -----------------

function nextScene(scene_id = null) {
	console.log(scene_id)
	if (scene_id) {
		if (scene_id == "end") {
			endChapter();
		} else {
			start(scene_id);
		}
	} else {
		throw new Error(scene_id + " is not a valid id!");
	}
}

function nextDialogue() {
	const scene = currentScene();


	if (scene.dialogues.length > Current.dialogue + 1) {
		
		Current.dialogue += 1

		loadDialogue(scene.dialogues[Current.dialogue])
	}

	else if (scene.dialogues[Current.dialogue].goto) {
		nextScene(scene.dialogues[Current.dialogue].goto)
	}
	else
	{
		console.log(scene)
		throw new Error ("cant go to next!")
	}

}

function endChapter() {
	console.log("TODO: ending CHapter!");
}

//INTERACTION AND BUTTONS ------------------------------------------

//one action per button | button: DOMElement
function registerButtonClick(callback, button = html.nextbutton) {
	console.log("LOG: setting what <" + button.id + "> does");

	removeClicks(button);

	if (callback) {
		register(button, callback);
	} else {
		console.log("LOG: <" + button.id + "> does nothing!");
	}
}

// adds all callbacks
function register(element, ...callbacks) {
	const e = $(element);

	let functions = 0;
	callbacks.forEach((callback) => {
		e.on("click", callback);
		functions++;
	});

	console.log(
		"LOG: new functions (" +
			functions +
			") registered to element id: " +
			element.id
	);
}

//removes all click listeenrs
function removeClicks(element) {
	const e = $(element);

	console.log("LOG: clicks unregistered");
	e.off("click");
}

// setting user data -----------------

function setUserFlags(...flags) {
	console.log("LOG: Setting Flags on user!");
	flags.forEach((flag) => {
		if (!PlayerState.flags.includes(flag)) {
			PlayerState.flags.push(flag);
		}
	});
}

function userHasFlags(...flags) {
	let hasFlags = true;

	flags.forEach((flag) => {
		if (!PlayerState.flags.includes(flag)) {
			hasFlags = false;
		}
	});

	return hasFlags;
}

//SAVING LOADING -----------------------------

function saveState(
	chapter = Current.chapter.id,
	scene = Current.scene,
	dialogue = Current.dialogue,
	saveSlot = 0
) {
	console.log("saving!");
	//showSaveIcon()

	const gameState = {
		save_id: "save-" + saveSlot,
		playerState: PlayerState,
		coordinates: {
			chapter_id: chapter,
			scene_id: scene,
			dialogue_index: dialogue,
		},
		lastSaved: new Date(),
	};

	//console.log(gameState);

	SaveManager.saveGameState(gameState)
		.then(() => console.log("Game state saved successfully"))
		.catch((error) => console.error("Failed to save game state", error));
}

//UTIL=======================

function findScene(chapter, scene_id) {
	//if scene = "end" ...

	for (let i = 0; i < chapter.scenes.length; i++) {
		let scene = chapter.scenes[i];

		//console.log(scene.id);
		if (scene.id == scene_id) {
			return scene;
		}
	}

	console.log("NO SCENE WITH ID " + scene_id + " EXISTS");

	return undefined;
}

function currentScene() {
	return findScene(Current.chapter, Current.scene);
}

// UI util-------------------------------

function clear(element) {
	element.innerHTML = "";
}

//hiding and showing without breaking flow
function hide(...elements) {
	elements.forEach((element) => {
		element.style.visibility = "hidden";
	});
}

function show(...elements) {
	elements.forEach((element) => {
		element.style.visibility = "visible";
	});
}

function isHidden(element) {
	return (element.style.visibility = "hidden");
}

//how the display shout be set to
function display(element, state) {
	element.style.display = state;
}

function disableButton(button) {
	button.classList.remove("enabled");
	button.classList.add("disabled");
}

function enableButton(button) {
	button.classList.remove("disabled");
	button.classList.add("enabled");
}

function changeBackground(element, bg = "black") {
	if (bg && element) {
		if (bg == "black") {
			element.style.backgroundImage = `none`;
			element.style.backgroundColor = bg;
		} else {
			element.style.backgroundImage = `url(${bg})`;
		}
	} else {
		console.log("ERROR: problem(s) with drawing background:");
		if (!element) {
			console.log("invalid element");
		}
		if (!bg) {
			console.log("invalid background");
		}
	}
}

function setTextbox(text) {
	show(html.textbox);
	const textbox = html.text;
	//animatetext
	textbox.textContent = text;
}

function setNametag(name) {
	const namebox = html.nametag;
	show(namebox);

	if (name === "Player") {
		name = PlayerState.name;
	}

	namebox.textContent = name;
}

// SPECIFIC UI FUNCTIONS ==================== for a declarative approach or whatever

function disableMenu() {
	const menuitems = html.menu.querySelectorAll(".dddsim-talkbox-menu-item");

	menuitems.forEach((button) => {
		disableButton(button);
	});
}

function enableMenu() {
	const menuitems = html.menu.querySelectorAll(".dddsim-talkbox-menu-item");

	menuitems.forEach((button) => {
		enableButton(button);
	});
}

function disableNextButton() {
	const next = html.nextbutton;

	disableButton(next);
}

function enableNextButton() {
	const next = html.nextbutton;

	enableButton(next);
}

//removes talking tag from all sprites
function removeTalkingSprites() {
	let characters = $(html.characters);

	characters.children().removeClass("talking");
}
