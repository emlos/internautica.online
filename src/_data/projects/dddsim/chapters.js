const data = require('./gamedata')

const backgrounds = data.backgrounds
const characters = data.characters
const PlayerState = data.playerstate

const chapter1 = {
  title: 'the Old road',
  id: 'chapter_01',
  start: 'intro-old-road-start',
  scenes: [
    {
      //on init render first dialogue
      id: 'intro-old-road-start',
      background: backgrounds.placeholder,
      dialogues: [
        //cant be empty
        {
          characters: null,
          speaking: 'Narrator',
          text: ['What is your name?'], //draw one after the other for multiple lines
          input: 'name'
        },
        {
          characters: null,
          speaking: 'Narrator',
          text: ['Ruin has come to our family.'], //draw one after the other for multiple lines
          choices: null
        },
        {
          characters: null,
          speaking: 'Player',
          text: ['The brigands are on us! Defend me!'],
          choices: [
            {
              text: 'Hide in the Stagecoach.',
              flags: null,
              goto: 'intro-hid-during-attack-scene'
            },
            {
              text: 'Help them with a makeshift weapon.',
              flags: null,
              goto: 'end'
            }
          ]
        }
      ]
    },
    {
      id: 'intro-hid-during-attack-scene',
      background: backgrounds.introcarriage,
      dialogues: [
        {
          characters: null,
          speaking: 'Narrator',
          text: [
            'You hear shouts as you crawl into your stagecoach.',
            'Looking out, you see your guards draw their weapons.'
          ], //draw one after the other for multiple lines
          choices: null
        },
        {
          characters: [characters.Dismas],
          speaking: 'Dismas',
          text: ['Good! Keep your head down, pipsqueak!']
        },
        {
          characters: [characters.Dismas, characters.Reynauld],
          speaking: 'Reynauld',
          text: [
            "This is no way to talk to our generous benefactor, thief. Now to arms! T'is an ambush!"
          ]
        },
        {
          characters: [characters.Dismas],
          speaking: 'Dismas',
          text: ["Fuckin'-", "Yeah Yeah, I'm comin'"]
        },
        {
          characters: [characters.Dismas, characters.Reynauld],
          speaking: 'Narratror',
          text: [
            'Your voice carries over the cacophonous sounds of battle, as you watch and command from the back.',
            'Directing them, you make sure to align the situation to the safety of...'
          ],
          choices: [
            {
              text: 'Dismas.',
              flags: ['dismas_route_started'],
              goto: null
            },
            {
              text: 'Reynauld.',
              flags: ['reynauld_route_started'],
              goto: null
            }
          ]
        },

        {
          characters: [characters.Dismas],
          speaking: 'Narrator',
          text: [
            'Blood drips from blades, after the dust falls. ',
            'Your eyes dart to Dismas, assessing him of any harm.',
            'He catches you looking at him from the corner of his eye, and the corners of his eyes lift.'
          ],
          conditions: ['dismas_route_started'], //flag name
          goto: null
        },

        {
          characters: [characters.Dismas],
          speaking: 'Dismas',
          text: [
            'Heh, not even a scratch.',
            "So, ya gonna keep starin', or are we marchin' on? It's a day's walk to the hamlet from 'ere."
          ],
          conditions: ['dismas_route_started'], //flag name
          goto: null
        },

        {
          characters: [characters.Reynauld],
          speaking: 'Narrator',
          text: [
            'Crimson ribbons are splattered against dented plate, as the battle ends.',
            'Immediately you survey your armeds companions state.',
            'He turns to you, sheathing his sword, and does somethign sexy idk reynauld.'
          ],
          conditions: ['reynauld_route_started'], //flag name
          goto: null
        },

        {
          characters: [characters.Reynauld],
          speaking: 'Reynauld',
          text: ['Thou insincts were shrewd, Light be thanked.'],
          conditions: ['reynauld_route_started'], //flag name
          goto: null
        },

        {
          characters: [characters.Reynauld],
          speaking: 'Narrator',
          text: [
            "You can't be sure but he sounds like he's smiling under all that armor."
          ],
          conditions: ['reynauld_route_started'], //flag name
          goto: null
        },

        {
          characters: [characters.Reynauld],
          speaking: 'Reynauld',
          text: [
            "We need to make haste. 'Tis a few hour's walk til we reach the estate, we must march swiftly."
          ],
          conditions: ['reynauld_route_started'], //flag name
          goto: null
        },

        {
          characters: [characters.Dismas, characters.Reynauld],
          speaking: 'Narrator',
          text: [
            "In the end, blades glinting, guns blazing, your two companions managed to fend off the bringand's ambuscade.",
            'As dawn broke, you took the trek to the estate, protected by light and darkness alike.'
          ],
          goto: 'intro-old-road-end'
        }
      ]
    },
    {
      id: 'intro-old-road-end',
      background: backgrounds.placeholder,
      dialogues: [
        {
          characters: null,
          speaking: 'Narrator',
          text: ['You reach the hamlet in a few hours.'],
          choices: null
        },
        {
          characters: [characters.Dismas],
          speaking: 'Narrator',
          text: [
            "You couldn't tear your gaze away from Dismas as some more ruffians attacked you during the trek.",
            'Now that you have reached the dilapidated town, the enormity of your ancestors wish finally sinks in.',
            'What ruin has he left you?'
          ],
          choices: null,
          conditions: ['dismas_route_started']
        },
        {
          characters: [characters.Dismas],
          speaking: 'Dismas',
          text: [
            `Hey now, ${PlayerState.name}, what'cha lookin' all downtrodden for?`,
            "Let's go down, and see what the pervious owner's done with this place."
          ],
          choices: null,
          conditions: ['dismas_route_started']
        },
        {
          characters: [characters.Dismas],
          speaking: 'Narrator',
          text: [
            'He climbs down with the grace of a fox, showing both you and the knight where to step.'
          ],
          choices: null,
          conditions: ['dismas_route_started']
        },

        {
          characters: [characters.Reynauld],
          speaking: 'Narrator',
          text: [
            'The knight stayed silent throughout the journey home.',
            'As much as you were curious about why he came on what clearly was a doomed undertaking, there was no time to chat.',
            'Now, as you stared down at the remnants of your houses glory, a shover ran through you.'
          ],
          choices: null,
          conditions: ['reynauld_route_started']
        },
        {
          characters: [characters.Reynauld],
          speaking: 'Reynauld',
          text: ['Keep your courage, my friend.'],
          choices: null,
          conditions: ['reynauld_route_started']
        },
        {
          characters: [characters.Reynauld],
          speaking: 'Narrator',
          text: [
            'His hand feels heavy on your shoulder, though reassuringly so.'
          ],
          choices: null,
          conditions: ['reynauld_route_started']
        },
        {
          characters: [characters.Reynauld],
          speaking: 'Reynauld',
          text: [
            "The Abbeys light's are shining bright.",
            'Where there art the men of Light, we shall find allies.'
          ],
          choices: null,
          conditions: ['reynauld_route_started']
        },
        {
          characters: [characters.Reynauld],
          speaking: 'Narrator',
          text: [
            'He makes sure you make it down safely, the thief following behind.'
          ],
          choices: null,
          conditions: ['reynauld_route_started']
        },

        {
          characters: null,
          speaking: 'Narrator',
          text: [
            'And so you made it safely into the heart of your ancestors glory.',
            'At least with Dismas by your side scouting those corrupted lands will be a bit less impossible now.'
          ],
          goto: 'end'
        }
      ]
    }
  ]
}

const game = {
  characters: {
    Dismas: {
      name: 'Dismas',
      sprites: {
        angry: '/images/projects/dddsim/characters/dismas/angry.png',
        neutral: '/images/projects/dddsim/characters/dismas/neutral.png'
      }
    },
    Reynauld: {
      name: 'Reynauld',
      sprites: {
        angry: '/images/projects/dddsim/characters/reynauld/angry.png',
        neutral: '/images/projects/dddsim/characters/reynauld/neutral.png'
      }
    }
  },
  chapters: [
    {
      scenes: [
        {
          id: 'start',
          dialogues: [
            {
              text: 'Ruin has come to our family.',
              speaking: 'Narrator',
              characters: [],
              input: null,
              choices: null,
              background: null,
              conditions: null,
              flags: null,
              goto: null
            },
            {
              text: 'In my darkest hour - hope turned her derisive gaze upon this wretched estate.',
              speaking: 'Narrator',
              characters: [],
              input: null,
              choices: null,
              background: null,
              conditions: null,
              flags: null,
              goto: null
            },
            {
              text: 'Before my untimely demise I contacted one of my kin.',
              speaking: 'Narrator',
              characters: [],
              input: null,
              choices: null,
              background: null,
              conditions: null,
              flags: null,
              goto: null
            },
            {
              text: 'A meager fail-safe as it was, my penance was complete.',
              speaking: 'Narrator',
              characters: [],
              input: null,
              choices: null,
              background: null,
              conditions: null,
              flags: null,
              goto: null
            },
            {
              text: 'The name on the missive...',
              speaking: 'Narrator',
              characters: [],
              input: 'name',
              choices: null,
              background: null,
              conditions: null,
              flags: null,
              goto: null
            },
            {
              text: 'Shrieks of the wheels, crying of the horses - an ambush!',
              speaking: 'Narrator',
              characters: [],
              input: null,
              choices: null,
              background: null,
              conditions: null,
              flags: null,
              goto: null
            },
            {
              text: 'The brigands are on us! Defend me!',
              speaking: 'Player',
              characters: [
                {
                  name: 'Dismas',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/dismas/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/dismas/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                },
                {
                  name: 'Reynauld',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/reynauld/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/reynauld/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                }
              ],
              input: null,
              choices: [
                {
                  text: 'Hide in the stagecoach.',
                  flags: [],
                  goto: 'ambush_hid'
                }
              ],
              background: null,
              conditions: null,
              flags: null,
              goto: 'end'
            }
          ],
          parentChapter: 'first_chapter',
          background:
            '/images/projects/dddsim/backgrounds/intro-broken-carriage.png'
        },
        {
          id: 'ambush_hid',
          dialogues: [
            {
              text: 'You hear shouts as you crawl into your stagecoach',
              speaking: 'Narrator',
              characters: [],
              input: null,
              choices: null,
              background: null,
              conditions: null,
              flags: null,
              goto: null
            },
            {
              text: 'Looking out, you see your guards draw their weapons.',
              speaking: 'Narrator',
              characters: [],
              input: null,
              choices: null,
              background: null,
              conditions: null,
              flags: null,
              goto: null
            },
            {
              text: 'Good! Keep your head down, pipsqueak!',
              speaking: 'Dismas',
              characters: [
                {
                  name: 'Dismas',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/dismas/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/dismas/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                }
              ],
              input: null,
              choices: null,
              background: null,
              conditions: null,
              flags: null,
              goto: null
            },
            {
              text: 'This is no way to talk to our generous benefactor, thief.',
              speaking: 'Reynauld',
              characters: [
                {
                  name: 'Dismas',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/dismas/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/dismas/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                },
                {
                  name: 'Reynauld',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/reynauld/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/reynauld/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                }
              ],
              input: null,
              choices: null,
              background: null,
              conditions: null,
              flags: null,
              goto: null
            },
            {
              text: "Now to arms! T'is an ambush!",
              speaking: 'Reynauld',
              characters: [
                {
                  name: 'Dismas',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/dismas/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/dismas/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                },
                {
                  name: 'Reynauld',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/reynauld/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/reynauld/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                }
              ],
              input: null,
              choices: null,
              background: null,
              conditions: null,
              flags: null,
              goto: null
            },
            {
              text: "Fuckin'-",
              speaking: 'Dismas',
              characters: [
                {
                  name: 'Dismas',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/dismas/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/dismas/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                },
                {
                  name: 'Reynauld',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/reynauld/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/reynauld/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                }
              ],
              input: null,
              choices: null,
              background: null,
              conditions: null,
              flags: null,
              goto: null
            },
            {
              text: "Yeah Yeah, I'm comin'",
              speaking: 'Dismas',
              characters: [
                {
                  name: 'Dismas',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/dismas/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/dismas/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                }
              ],
              input: null,
              choices: null,
              background: null,
              conditions: null,
              flags: null,
              goto: null
            },
            {
              text: 'Your voice carries over the cacophonous sounds of battle, as you watch and command from the back.',
              speaking: 'Narrator',
              characters: [],
              input: null,
              choices: null,
              background: null,
              conditions: null,
              flags: null,
              goto: null
            },
            {
              text: 'Directing them, you make sure to align the situation to the safety of...',
              speaking: 'Narrator',
              characters: [],
              input: null,
              choices: [
                { text: 'Dismas.', flags: ['dismas_route_started'], goto: '' },
                {
                  text: 'Reynauld.',
                  flags: ['reynauld_route_started'],
                  goto: ''
                }
              ],
              background: null,
              conditions: null,
              flags: null,
              goto: null
            },
            {
              text: 'Blood drips from blades, after the dust falls.',
              speaking: 'Narrator',
              characters: [
                {
                  name: 'Dismas',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/dismas/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/dismas/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                }
              ],
              input: null,
              choices: null,
              background: null,
              conditions: ['dismas_route_started'],
              flags: null,
              goto: null
            },
            {
              text: 'Your eyes dart to Dismas, assessing him of any harm.',
              speaking: 'Narrator',
              characters: [
                {
                  name: 'Dismas',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/dismas/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/dismas/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                }
              ],
              input: null,
              choices: null,
              background: null,
              conditions: ['dismas_route_started'],
              flags: null,
              goto: null
            },
            {
              text: 'He catches you looking at him from the corner of his eye, and the corners of his eyes lift.',
              speaking: 'Narrator',
              characters: [
                {
                  name: 'Dismas',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/dismas/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/dismas/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                }
              ],
              input: null,
              choices: null,
              background: null,
              conditions: ['dismas_route_started'],
              flags: null,
              goto: null
            },
            {
              text: 'Heh, not even a scratch. Not bad.',
              speaking: 'Dismas',
              characters: [
                {
                  name: 'Dismas',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/dismas/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/dismas/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                }
              ],
              input: null,
              choices: null,
              background: null,
              conditions: ['dismas_route_started'],
              flags: null,
              goto: null
            },
            {
              text: "So, ya gonna keep starin', or are we marchin' on? It's a day's walk to the hamlet from 'ere.",
              speaking: 'Dismas',
              characters: [
                {
                  name: 'Dismas',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/dismas/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/dismas/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                }
              ],
              input: null,
              choices: null,
              background: null,
              conditions: ['dismas_route_started'],
              flags: null,
              goto: null
            },
            {
              text: "Crimson ribbons adorn the knight's second skin as the battle ends.",
              speaking: 'Narrator',
              characters: [
                {
                  name: 'Dismas',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/dismas/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/dismas/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                },
                {
                  name: 'Reynauld',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/reynauld/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/reynauld/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                }
              ],
              input: null,
              choices: null,
              background: null,
              conditions: ['reynauld_route_started'],
              flags: null,
              goto: null
            },
            {
              text: 'Immediately you survey your armeds companions state, making sure the blood is not his.',
              speaking: 'Narrator',
              characters: [
                {
                  name: 'Dismas',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/dismas/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/dismas/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                },
                {
                  name: 'Reynauld',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/reynauld/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/reynauld/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                }
              ],
              input: null,
              choices: null,
              background: null,
              conditions: ['reynauld_route_started'],
              flags: null,
              goto: null
            },
            {
              text: 'He turns to you, sheathing his sword, and does somethign sexy idk reynauld.',
              speaking: 'Narrator',
              characters: [
                {
                  name: 'Dismas',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/dismas/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/dismas/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                },
                {
                  name: 'Reynauld',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/reynauld/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/reynauld/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                }
              ],
              input: null,
              choices: null,
              background: null,
              conditions: ['reynauld_route_started'],
              flags: null,
              goto: null
            },
            {
              text: 'Thou insincts were shrewd, Light be thanked',
              speaking: 'Reynauld',
              characters: [
                {
                  name: 'Dismas',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/dismas/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/dismas/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                },
                {
                  name: 'Reynauld',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/reynauld/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/reynauld/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                }
              ],
              input: null,
              choices: null,
              background: null,
              conditions: ['reynauld_route_started'],
              flags: null,
              goto: null
            },
            {
              text: "You can't be sure but he sounds like he's smiling under all that armor.",
              speaking: 'Narrator',
              characters: [
                {
                  name: 'Dismas',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/dismas/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/dismas/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                },
                {
                  name: 'Reynauld',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/reynauld/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/reynauld/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                }
              ],
              input: null,
              choices: null,
              background: null,
              conditions: ['reynauld_route_started'],
              flags: null,
              goto: null
            },
            {
              text: "We need to make haste. 'Tis a few hour's walk til we reach the estate, we must march swiftly.",
              speaking: 'Reynauld',
              characters: [
                {
                  name: 'Dismas',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/dismas/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/dismas/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                },
                {
                  name: 'Reynauld',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/reynauld/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/reynauld/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                }
              ],
              input: null,
              choices: null,
              background: null,
              conditions: ['reynauld_route_started'],
              flags: null,
              goto: null
            },
            {
              text: "In the end, blades glinting, guns blazing, your two companions managed to fend off the bringand's ambuscade.",
              speaking: 'Narrator',
              characters: [
                {
                  name: 'Dismas',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/dismas/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/dismas/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                },
                {
                  name: 'Reynauld',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/reynauld/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/reynauld/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                }
              ],
              input: null,
              choices: null,
              background:
                '/images/projects/dddsim/backgrounds/intro-view-town.png',
              conditions: null,
              flags: null,
              goto: null
            },
            {
              text: 'As dawn broke, you took the trek to the estate, protected by light and darkness alike.',
              speaking: 'Narrator',
              characters: [
                {
                  name: 'Dismas',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/dismas/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/dismas/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                },
                {
                  name: 'Reynauld',
                  sprites: {
                    angry:
                      '/images/projects/dddsim/characters/reynauld/angry.png',
                    neutral:
                      '/images/projects/dddsim/characters/reynauld/neutral.png'
                  },
                  defaultEmotion: 'neutral'
                }
              ],
              input: null,
              choices: null,
              background:
                '/images/projects/dddsim/backgrounds/intro-view-town.png',
              conditions: null,
              flags: null,
              goto: 'end'
            }
          ],
          parentChapter: 'first_chapter',
          background:
            '/images/projects/dddsim/backgrounds/intro-broken-carriage.png'
        }
      ],
      id: 'first_chapter',
      order: -1,
      title: 'The Old Road',
      start: 'start'
    }
  ]
}

module.exports = {
  gameName: 'Heart of Darkness: A DD1 Dating Sim',
  chapters: game.chapters
}
