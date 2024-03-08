const data = require("./gamedata");

const Bgs = data.Bgs;
const Characters = data.Characters;
const PlayerState = data.PlayerState;

const chapter1 = {
	title: "the Old road",
	id: "chapter_01",
	start: "intro-old-road-start",
	scenes: [
		{
			//on init render first dialogue
			id: "intro-old-road-start",
			background: Bgs.Placeholder,
			dialogues: [ //cant be empty
				{
					characters: [Characters.Dismas, Characters.Reynauld],
					speaking: "Dismas",
					text: ["Ayo girl what'cha doin; there? "], //draw one after the other for multiple lines
				},
				{
					characters: [],
					speaking: "Narrator",
					text: ["Ruin has come to our family."], //draw one after the other for multiple lines
					choices: null,
				},
				{
					characters: [],
					speaking: "Player",
					text: ["The brigands are on us! Defend me!"],
					choices: [
						{
							text: "Hide in the Stagecoach.",
							flags: null,
							goto: "intro-hid-during-attack-scene",
						},
						{
							text: "Help them with a makeshift weapon.",
							flags: null,
							goto: "end",
						},
					],
				},
			],
		},
		{
			id: "intro-hid-during-attack-scene",
			background: Bgs.IntroCarriage,
			dialogues: [
				{
					characters: [],
					speaking: "Narrator",
					text: [
						"You hear shouts as you crawl into your stagecoach.",
						"Looking out, you see your guards draw their weapons.",
					], //draw one after the other for multiple lines
					choices: null,
				},
				{
					characters: [Characters.Dismas],
					speaking: "Dismas",
					text: ["Good! Keep your head down, pipsqueak!"],
				},
				{
					characters: [Characters.Dismas, Characters.Reynauld],
					speaking: "Reynauld",
					text: [
						"This is no way to talk to our generous benefactor, thief. Now to arms! T'is an ambush!",
					],
				},
				{
					characters: [Characters.Dismas],
					speaking: "Dismas",
					text: ["Fuckin'-", "Yeah Yeah, I'm comin'"],
				},
				{
					characters: [
						Characters.Dismas,
						Characters.Reynauld,
	
					],
					speaking: "Narratror",
					text: [
						"Your voice carries over the cacophonous sounds of battle, as you watch and command from the back.",
						"Directing them, you make sure to align the situation to the safety of...",
					],
					choices: [
						{
							text: "Dismas.",
							flags: ["dismas_route_started"],
							goto: null,
						},
						{
							text: "Reynauld.",
							flags: ["reynauld_route_started"],
							goto: null,
						},
					],
				},

				{
					characters: [Characters.Dismas],
					speaking: "Narrator",
					text: [
						"Blood drips from blades, after the dust falls. ",
						"Your eyes dart to Dismas, assessing him of any harm.",
						"He catches you looking at him from the corner of his eye, and the corners of his eyes lift.",
					],
					conditions: ["dismas_route_started"], //flag name
					goto: null,
				},

				{
					characters: [Characters.Dismas, ],
					speaking: "Dismas",
					text: [
						"Heh, not even a scratch.",
						"So, ya gonna keep starin', or are we marchin' on? It's a day's walk to the hamlet from 'ere.",
					],
					conditions: ["dismas_route_started"], //flag name
					goto: null,
				},

				{
					characters: [Characters.Reynauld, ],
					speaking: "Narrator",
					text: [
						"Crimson ribbons are splattered against dented plate, as the battle ends.",
						"Immediately you survey your armeds companions state.",
						"He turns to you, sheathing his sword, and does somethign sexy idk reynauld.",
					],
					conditions: ["reynauld_route_started"], //flag name
					goto: null,
				},

				{
					characters: [Characters.Reynauld, ],
					speaking: "Reynauld",
					text: ["Thou insincts were shrewd, Light be thanked."],
					conditions: ["reynauld_route_started"], //flag name
					goto: null,
				},

				{
					characters: [Characters.Reynauld, ],
					speaking: "Narrator",
					text: [
						"You can't be sure but he sounds like he's smiling under all that armor.",
					],
					conditions: ["reynauld_route_started"], //flag name
					goto: null,
				},

				{
					characters: [Characters.Reynauld, ],
					speaking: "Reynauld",
					text: [
						"We need to make haste. 'Tis a few hour's walk til we reach the estate, we must march swiftly.",
					],
					conditions: ["reynauld_route_started"], //flag name
					goto: null,
				},

				{
					characters: [
						Characters.Dismas,
						Characters.Reynauld,
						
					],
					speaking: "Narrator",
					text: [
						"In the end, blades glinting, guns blazing, your two companions managed to fend off the bringand's ambuscade.",
						"As dawn broke, you took the trek to the estate, protected by light and darkness alike.",
					],
					goto: "intro-old-road-end",
				},
			],
		},

		{
			id: "intro-old-road-end",
			background: Bgs.HamletViewDay,
			dialogues: [
				{
					characters: [],
					speaking: "Narrator",
					text: ["You reach the hamlet in a few hours."],
					choices: null,
				},
				{
					characters: [Characters.Dismas],
					speaking: "Narrator",
					text: [
						"You couldn't tear your gaze away from Dismas as some more ruffians attacked you during the trek.",
						"Now that you have reached the dilapidated town, the enormity of your ancestors wish finally sinks in.",
						"What ruin has he left you?",
					],
					choices: null,
					conditions: "dismas_route_started",
				},
				{
					characters: [Characters.Dismas, ],
					speaking: "Dismas",
					text: [
						`Hey now, ${PlayerState.name}, what'cha lookin' all downtrodden for?`,
						"Let's go down, and see what the pervious owner's done with this place.",
					],
					choices: null,
					conditions: "dismas_route_started",
				},
				{
					characters: [Characters.Dismas, ],
					speaking: "Narrator",
					text: [
						"He climbs down with the grace of a fox, showing both you and the knight where to step.",
					],
					choices: null,
					conditions: "dismas_route_started",
				},

				{
					characters: [Characters.Reynauld, ],
					speaking: "Narrator",
					text: [
						"The knight stayed silent throughout the journey home.",
						"As much as you were curious about why he came on what clearly was a doomed undertaking, there was no time to chat.",
						"Now, as you stared down at the remnants of your houses glory, a shover ran through you.",
					],
					choices: null,
					conditions: "reynauld_route_started",
				},
				{
					characters: [Characters.Reynauld, ],
					speaking: "Reynauld",
					text: ["Keep your courage, my friend."],
					choices: null,
					conditions: "reynauld_route_started",
				},
				{
					characters: [Characters.Reynauld, ],
					speaking: "Narrator",
					text: [
						"His hand feels heavy on your shoulder, though reassuringly so.",
					],
					choices: null,
					conditions: "reynauld_route_started",
				},
				{
					characters: [Characters.Reynauld,],
					speaking: "Reynauld",
					text: [
						"The Abbeys light's are shining bright.",
						"Where there art the men of Light, we shall find allies.",
					],
					choices: null,
					conditions: "reynauld_route_started",
				},
				{
					characters: [Characters.Reynauld, ],
					speaking: "Narrator",
					text: [
						"He makes sure you make it down safely, the thief following behind.",
					],
					choices: null,
					conditions: "reynauld_route_started",
				},

				{
					characters: [],
					speaking: "Narrator",
					text: [
						"And so you made it safely into the heart of your ancestors glory.",
						"At least with Dismas by your side scouting those corrupted lands will be a bit less impossible now.",
					],
					goto: "end",
				},
			],
		},
	],
};

module.exports = {
	gameName: "Heart of Darkness: A DD1 Dating Sim",
	chapters: [chapter1],
};
