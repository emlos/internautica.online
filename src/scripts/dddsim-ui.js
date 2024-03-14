/*
 *  const cheat sheet:
 *
 *  Story: {gameName, chapters: []}
 *  PlayerState: {name, flags, reputation: {}}
 *  Characters: {<Name>: {name, sprites: {<neutral, happy etc>: string}}}
 *  Bgs: {<Name>: string}
 *
 */

const CURRENT = {
  chapter: Story.chapters[0], //while generating each chapter page fill this into the template via script
  scene: 'some scene id',
  dialogue: 0, //which dialogues[n] index scene is at
  saveSlot: -1
}

//html targets -------------
const HTML = {
  textbox: document.createElement('div'),
  nametag: document.createElement('div'), //inside the talk-panel
  text: document.createElement('p'), //inside the talk-panel
  menu: document.createElement('div'), //inside the talk-panel
  nextbutton: document.createElement('button'), //inside the talk-panel
  optionsbutton: document.createElement('button'), //inside the talk-panel
  inputpanel: document.createElement('div'),
  inputbox: document.createElement('inout'), // inside inputpanel input element
  confirminputbutton: document.createElement('button'), // inside inputpanel
  randominputbutton: document.createElement('button'), // inside inputpanel
  choices: document.createElement('div'),
  characters: document.createElement('div'),

  background: document.createElement('div'), // background IMAGE in div
  overlay: document.createElement('div')
}

// INIT----------------------------------

function init () {
  HTML.nametag = document.getElementById('nametag')
  HTML.textbox = document.getElementById('talk-panel')
  HTML.characters = document.getElementById('sprite-panel')
  HTML.choices = document.getElementById('choice-panel')
  HTML.text = document.getElementById('line')
  HTML.menu = document.getElementById('game-menu')
  HTML.nextbutton = document.getElementById('next-line-button')
  HTML.optionsbutton = document.getElementById('options-button')
  HTML.inputpanel = document.getElementById('input-textbox-panel')
  HTML.inputbox = document.getElementById('talkbox-text-input')
  HTML.confirminputbutton = document.getElementById('confirm-textinput-button')

  HTML.randominputbutton = document.getElementById('random-textinput-button')

  HTML.background = document.getElementById('background-panel')

  HTML.overlay = document.getElementById('overlay')

  //console.log(html);

  //loadMainMenu()

  //loadSaves()

  showTitle(CURRENT.chapter.title)

  //start chapter
  registerButtonClick(function () {
    start(CURRENT.chapter.start)
  })
}

function start (scene_id) {
  console.log('LOG: starting scene: ' + scene_id)

  registerButtonClick(false)

  CURRENT.scene = scene_id
  CURRENT.dialogue = 0

  const scn = currentScene()
  const first = scn.dialogues[CURRENT.dialogue]

  //console.log(scn);

  enableMenu()

  changeBackground(HTML.background, scn.background)

  //todo: other SCENE setup

  loadDialogue(first)

  //continue here
}

function showTitle (title) {
  hide(
    HTML.characters,
    HTML.choices,
    HTML.nametag,
    HTML.overlay,
    HTML.optionsbutton
  )

  show(HTML.textbox, HTML.nextbutton, HTML.background, HTML.menu)
  display(HTML.inputpanel, 'none')

  changeBackground(HTML.background) //turn bg to black

  disableMenu()

  setTextbox(title)
}

function loadDialogue (dialogue) {
  console.log(
    'LOG: Loading dialogues[' +
      CURRENT.dialogue +
      '] in scene id: ' +
      CURRENT.scene
  )

  //console.log(dialogue)

  show(HTML.nextbutton, HTML.optionsbutton, HTML.menu)

  if (dialogueValid(dialogue.conditions)) {
    loadDialogueBackground(dialogue.background)

    loadDialogueCharacters(dialogue.characters, dialogue.speaking)

    loadDialogueText(dialogue.text[0])

    loadDialogueChoices(dialogue.choices)

    loadInput(dialogue.input)

    handleDialogueGoto()
  } else {
    nextDialogue() //load next dialogue next
  }
}

function dialogueValid (conditions) {
  if (!conditions) {
    console.log('LOG: dialogue has no flags!')
    return true
  }

  return userHasFlags(...conditions)
}

function loadDialogueCharacters (characters, speaking) {
  setNametag(speaking)
  show(HTML.nametag, HTML.characters, HTML.background)

  hide(HTML.overlay)

  clear(HTML.characters)

  if (!characters) {
    return
  }

  characters.forEach(char => {
    let sprite = char.sprites.neutral
    let cName = char.name

    let character = document.createElement('div')
    character.classList.add('dddsim-sprite')
    if (cName === speaking) character.classList.add('talking')
    changeBackground(character, sprite)

    HTML.characters.appendChild(character)
  })
}

function loadDialogueBackground (background) {
  if (background) {
    changeBackground(HTML.background, dialogue.background)
  } else {
    console.log('LOG: dialogue has no background!')

    const scn = currentScene() //use scene background
    changeBackground(HTML.background, scn.background)
  }
}

function loadDialogueText (text) {
  show(HTML.menu)
  show(HTML.textbox)
  show(HTML.nametag)

  setTextbox(text)
}

function loadDialogueChoices (choices) {
  clear(HTML.choices) //remove all choice buttons

  if (choices) {
    removeTalkingSprites()

    show(HTML.overlay, HTML.choices)

    hide(HTML.nextbutton)

    choices.forEach(choice => {
      let btn = document.createElement('button')

      btn.classList.add('dddsim-choice-button', 'panel', 'enabled')
      btn.id = 'button-choice-' + choice.id
      btn.innerHTML = choice.text

      choiceSetsFlags(choice, btn)
      choiceRedirects(choice, btn)

      HTML.choices.appendChild(btn)
    })
  } else {
    console.log('LOG: dialogue has no choices!')

    hide(HTML.overlay, HTML.choices)
    show(HTML.nextbutton)
  }
}

function loadInput (dialogueInput) {
  const names = [
    'Milo',
    'AM',
    'Zoosmell',
    'Dick Mullen',
    'Ring? Rang?',
    'Jadwiga',
    'Towarzysz',
    'Heir',
    'Ebony Way',
    '24601', "Paul Allen"
  ]

  //user is supposed to input
  if (dialogueInput) {
    hide(HTML.nextbutton) //can only go next after inputting
    display(HTML.inputpanel, 'flex')

    validateInput() //cached textboxes

    //register clicking on ok done writing
    registerButtonClick(() => {
      if (validateInput()) {
        setUserAttribute(dialogueInput, HTML.inputbox.value)
        display(HTML.inputpanel, 'none')

        removeInputEvents(HTML.inputbox)

        nextDialogue()
      }
    }, HTML.confirminputbutton)

    //random button click
    registerButtonClick(() => {
      HTML.inputbox.value = names[Math.floor(Math.random() * names.length)]
      HTML.inputbox.focus()
      validateInput()
    }, HTML.randominputbutton)

    //validate and unblock the next button
    registerInputs(HTML.inputbox, validateInput)

    HTML.inputbox.focus() //start user on in writing
  } else {
    console.log('LOG: dialogue has no input values!')
  }
}

//for names only
function validateInput () {
  const restrictednames = [
    'dismas',
    'reynauld',
    'junia',
    'paracelsus',
    'boudica',
    'audrey',
    'willam',
    'tardif',
    'amani',
    'barristan',
    'damian',
    'missandei',
    'margaret',
    'sahar',
    'sarmenti',
    'baldwin',
    'josephine',
    'bigby',
    'alhazred'
  ]

  const input = HTML.inputbox.value.toLowerCase().trim()

  if (!input) {
    setTooltip(
      HTML.confirminputbutton,
      'Gotta have something to call you, chief'
    )
    disableButton(HTML.confirminputbutton)
    return false
  } else if (restrictednames.includes(input)) {

    setTooltip(
      HTML.confirminputbutton,
      'Hey, ' + input + ' is *my* name! -' + input
    )
    disableButton(HTML.confirminputbutton)
    return false
  } else {
    setTooltip(HTML.confirminputbutton, '')

    enableButton(HTML.confirminputbutton)
    return true
  }
}

function handleDialogueGoto (scene_id) {
  if (scene_id) {
    hide(HTML.choices)
    show(HTML.nextbutton)
    registerButtonClick(function () {
      nextScene(scene_id)
    })
  } else {
    console.log('LOG: dialogue has no goto; goto is next dialogue!')
    registerButtonClick(function () {
      nextDialogue()
    })
  }
}

function choiceSetsFlags (choice, button) {
  if (choice.flags) {
    console.log('LOG: setting flags on choice ' + choice.id)

    registerClicks(button, function () {
      setUserFlags(...choice.flags)
    })
  } else {
    console.log('LOG: choice ' + choice.id + ' has no Flags!')
  }
}

function choiceRedirects (choice, button) {
  if (choice.goto) {
    console.log('LOG: setting goto on choice ' + choice.id)

    registerClicks(button, function () {
      nextScene(choice.goto)
    })
  } else {
    console.log(
      'LOG: choice ' + choice.id + ' has no goto; goto is next dialogue.'
    )
    registerClicks(button, function () {
      nextDialogue()
    })
  }
}

// STORY FLOW-------------- -----------------

function nextScene (scene_id = null) {
  console.log(scene_id)
  if (scene_id) {
    if (scene_id == 'end') {
      endChapter()
    } else {
      start(scene_id)
    }
  } else {
    throw new Error(scene_id + ' is not a valid id!')
  }
}

function nextDialogue () {
  const scene = currentScene()

  if (scene.dialogues.length > CURRENT.dialogue + 1) {
    CURRENT.dialogue += 1

    loadDialogue(scene.dialogues[CURRENT.dialogue])
  } else if (scene.dialogues[CURRENT.dialogue].goto) {
    nextScene(scene.dialogues[CURRENT.dialogue].goto)
  } else {
    console.log(scene)
    throw new Error('cant go to next!')
  }
}

function endChapter () {
  console.log('TODO: ending CHapter!')
}

//INTERACTION AND BUTTONS ------------------------------------------

function setTooltip (element, text) {
  element.title = text
}

//one action per button | button: DOMElement
function registerButtonClick (callback, button = HTML.nextbutton) {
  console.log('LOG: setting what <' + button.id + '> does')

  removeClicks(button)

  if (callback) {
    registerClicks(button, callback)
  } else {
    console.log('LOG: <' + button.id + '> does nothing!')
  }
}

// adds all callbacks
function registerClicks (element, ...callbacks) {
  const e = $(element)

  let functions = 0
  callbacks.forEach(callback => {
    e.on('click', callback)
    functions++
  })

  console.log(
    'LOG: new functions (' +
      functions +
      ') registered to element id: ' +
      element.id +
      ' on click!'
  )
}

function registerInputs (element, ...callbacks) {
  const e = $(element)
  let functions = 0
  callbacks.forEach(callback => {
    e.on('input', callback)
    functions++
  })

  console.log(
    'LOG: new functions (' +
      functions +
      ') registered to element id: ' +
      element.id +
      ' on input!'
  )
}

//removes all click listeenrs
function removeClicks (element) {
  const e = $(element)

  e.off('click')

  console.log('LOG: clicks unregistered from ' + element.id)
}
function removeInputEvents (element) {
  const e = $(element)

  e.off('input')

  console.log('LOG: inputs unregistered from ' + element.id)
}

// setting user data -----------------

function setUserFlags (...flags) {
  console.log('LOG: Setting Flags on user! [' + flags.join(', ') + ']')
  flags.forEach(flag => {
    if (!PlayerState.flags.includes(flag)) {
      PlayerState.flags.push(flag)
    }
  })
}

function setUserAttribute (attr, value) {
  console.log('LOG: changing user state!')
  if (PlayerState[attr]) {
    console.log(
      'LOG: overwriting existing value: ' + PlayerState[attr] + ' to: ' + value
    )
  } else {
    console.log('LOG: new player attribute: ' + PlayerState[attr])
  }

  PlayerState[attr] = value
}

//true if user has all the param flags
function userHasFlags (...flags) {
  console.log(flags)
  console.log(PlayerState.flags)
  let hasFlags = true

  flags.forEach(flag => {
    if (!PlayerState.flags.includes(flag)) {
      hasFlags = false
    }
  })

  return hasFlags
}

//SAVING LOADING -----------------------------

function saveState (
  chapter = CURRENT.chapter.id,
  scene = CURRENT.scene,
  dialogue = CURRENT.dialogue,
  saveSlot = 0
) {
  console.log('saving!')
  //showSaveIcon()

  const gameState = {
    save_id: 'save-' + saveSlot,
    playerState: PlayerState,
    coordinates: {
      chapter_id: chapter,
      scene_id: scene,
      dialogue_index: dialogue
    },
    lastSaved: new Date()
  }

  //console.log(gameState);

  SaveManager.saveGameState(gameState)
    .then(() => console.log('Game state saved successfully'))
    .catch(error => console.error('Failed to save game state', error))
}

//UTIL=======================

function findScene (chapter, scene_id) {
  //if scene = "end" ...

  for (let i = 0; i < chapter.scenes.length; i++) {
    let scene = chapter.scenes[i]

    //console.log(scene.id);
    if (scene.id == scene_id) {
      return scene
    }
  }

  console.log('NO SCENE WITH ID ' + scene_id + ' EXISTS')

  return undefined
}

function currentScene () {
  return findScene(CURRENT.chapter, CURRENT.scene)
}

// UI util-------------------------------

function clear (element) {
  element.innerHTML = ''
}

//hiding and showing without breaking flow
function hide (...elements) {
  elements.forEach(element => {
    element.style.visibility = 'hidden'
  })
}

function show (...elements) {
  elements.forEach(element => {
    element.style.visibility = 'visible'
  })
}

function isHidden (element) {
  return (element.style.visibility = 'hidden')
}

//how the display shout be set to
function display (element, state) {
  element.style.display = state
}

function disableButton (button) {
  button.classList.remove('enabled')
  button.classList.add('disabled')
}

function enableButton (button) {
  button.classList.remove('disabled')
  button.classList.add('enabled')
}

function changeBackground (element, bg = 'black') {
  if (bg && element) {
    if (bg == 'black') {
      element.style.backgroundImage = `none`
      element.style.backgroundColor = bg
    } else {
      element.style.backgroundImage = `url(${bg})`
    }
  } else {
    console.log('ERROR: problem(s) with drawing background:')
    if (!element) {
      console.log('invalid element')
    }
    if (!bg) {
      console.log('invalid background')
    }
  }
}

function setTextbox (text) {
  show(HTML.textbox)
  const textbox = HTML.text
  //animatetext
  textbox.textContent = text
}

function setNametag (name) {
  const namebox = HTML.nametag
  show(namebox)

  if (name === 'Player') {
    name = PlayerState.name
  }

  namebox.textContent = name
}

// SPECIFIC UI FUNCTIONS ==================== for a declarative approach or whatever

function disableMenu () {
  const menuitems = HTML.menu.querySelectorAll('.dddsim-talkbox-menu-item')

  menuitems.forEach(button => {
    disableButton(button)
  })
}

function enableMenu () {
  const menuitems = HTML.menu.querySelectorAll('.dddsim-talkbox-menu-item')

  menuitems.forEach(button => {
    enableButton(button)
  })
}

function disableNextButton () {
  const next = HTML.nextbutton

  disableButton(next)
}

function enableNextButton () {
  const next = HTML.nextbutton

  enableButton(next)
}

//removes talking tag from all sprites
function removeTalkingSprites () {
  let characters = $(HTML.characters)

  characters.children().removeClass('talking')
}
