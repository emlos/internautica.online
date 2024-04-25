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
  currentChapter: 0,
  scene: 'some scene id',
  dialogue: 0, //which dialogues[n] index scene is at

  openModal: null, //which modal is open
  spaceHandler: {
    callbacks: new Map(),
    cooldown: 0.15 * 1000, //in ms
    last_space: Date.now() //when last space was clicked
  },

  saveHandles: {
    saves: [],
    saveSlot: null
  }
}

//html targets -------------
const HTML = {
  textbox: document.createElement('div'),
  nametag: document.createElement('div'), //inside the talk-panel
  text: document.createElement('p'), //inside the talk-panel
  menu: {
    panel: document.createElement('div'),
    start: document.createElement('button'),
    save: document.createElement('button'),
    load: document.createElement('button'),
    back: document.createElement('button')
  }, //inside the talk-panel
  nextbutton: document.createElement('button'), //inside the talk-panel
  optionsbutton: document.createElement('button'), //inside the talk-panel
  inputpanel: document.createElement('div'),
  inputbox: document.createElement('inout'), // inside inputpanel input element
  confirminputbutton: document.createElement('button'), // inside inputpanel
  randominputbutton: document.createElement('button'), // inside inputpanel
  choices: document.createElement('div'),
  characters: document.createElement('div'),

  background: document.createElement('div'), // background IMAGE in div
  overlay: document.createElement('div'),

  saves: {
    modal: document.createElement('div'), //saves panel for loading/saving
    slots: document.createElement('div') //container holding the divs for slots directly
  },
  popup: {
    modal: document.createElement('div'),
    text: document.createElement('p'),
    okbutton: document.createElement('button'),
    cancelbutton: document.createElement('button')
  }
}

// INIT----------------------------------

//initializes CHAPTER
function init () {
  HTML.nametag = document.getElementById('nametag')
  HTML.textbox = document.getElementById('talk-panel')
  HTML.characters = document.getElementById('sprite-panel')
  HTML.choices = document.getElementById('choice-panel')
  HTML.text = document.getElementById('line')
  //menu
  HTML.menu.panel = document.getElementById('game-menu')
  HTML.menu.start = document.getElementById('dddsim-start-menu-item')
  HTML.menu.save = document.getElementById('dddsim-save-menu-item')
  HTML.menu.load = document.getElementById('dddsim-load-menu-item')
  HTML.menu.back = document.getElementById('dddsim-back-menu-item')

  HTML.nextbutton = document.getElementById('next-line-button')
  HTML.optionsbutton = document.getElementById('options-button')
  HTML.inputpanel = document.getElementById('input-textbox-panel')
  HTML.inputbox = document.getElementById('talkbox-text-input')
  HTML.confirminputbutton = document.getElementById('confirm-textinput-button')

  HTML.randominputbutton = document.getElementById('random-textinput-button')

  HTML.background = document.getElementById('background-panel')

  HTML.overlay = document.getElementById('overlay')
  HTML.saves.modal = document.getElementById('saves-panel')

  HTML.popup.modal = document.getElementById('popup')
  HTML.popup.text = HTML.popup.modal.getElementsByTagName('p')[0]
  HTML.popup.okbutton = document.getElementById('popup-ok')
  HTML.popup.cancelbutton = document.getElementById('popup-cancel')
  //console.log(html);

  loadMainMenu()

  loadSideMenu()

  loadModals()

  loadSaves()

}

function initChapter(chapter){
  if(!chapter) chapter = CURRENT.chapter

  showTitle(chapter.title)


  //next button starts chapter
  registerButtonClick(function () {
    if (isHidden(HTML.overlay)) {
    }
  })

  //space advances chapter also
  spaceAdvances('[initial space press]', () => {
    start(CURRENT.chapter.start)
  })

}

function loadMainMenu () {
  hideAll()
  display(HTML.inputpanel, 'none')
  changeBackground(HTML.background, Story.background)
  setTextbox('')

  const title = document.createElement('h2')
  title.classList.add('dddsim-main-title')
  title.innerHTML = Story.gameName

  HTML.characters.appendChild(title)
  show(HTML.characters, HTML.textbox, HTML.menu.panel)
}

function loadSideMenu () {
  enableMenu()
  disableButton(HTML.menu.back)
  // disableButton(HTML.menu.save) //cant save in main menu

  //when start clicked
  registerButtonClick(() => {
    initChapter(CURRENT.chapter)

    //start restarts journey from now on
    registerButtonClick(() => {
      if (!isDisabled(HTML.menu.start) && isHidden(HTML.overlay)) {
        console.log('confirm restart?')
        HTML.menu.start.children.item(0).innerHTML = 'Restart'
        //confirmRestart()
        //initChapter(Story.chapters[0])
      }
    }, HTML.menu.start)
  }, HTML.menu.start)

  registerButtonClick(() => {
    if (!isDisabled(HTML.menu.load) && isHidden(HTML.overlay)) {
      openModal(HTML.saves.modal)
      HTML.saves.modal.setAttribute('data-mode', 'load')
    }
  }, HTML.menu.load)

  registerButtonClick(() => {
    if (!isDisabled(HTML.menu.save) && isHidden(HTML.overlay)) {
      openModal(HTML.saves.modal)
      HTML.saves.modal.setAttribute('data-mode', 'save')
    }
  }, HTML.menu.save)
}

function loadModals () {
  document.querySelectorAll('.close-modal-button').forEach(button => {
    registerButtonClick(() => {
      close(CURRENT.openModal)
    }, button)
  })
}

function loadSaves () {
  //1. find all current Saves from IndexDB
  //2. set them in the modal
}

//shows a "title" card
function showTitle (title) {
  hide(
    HTML.characters,
    HTML.choices,
    HTML.nametag,
    HTML.overlay,
    HTML.optionsbutton
  )

  show(HTML.textbox, HTML.nextbutton, HTML.background, HTML.menu.panel)
  display(HTML.inputpanel, 'none')

  changeBackground(HTML.background) //turn bg to black

  disableMenu()

  setTextbox(title)

}

//starts a scene
function start (scene_id) {
  log('starting scene: ' + scene_id)

  registerButtonClick(false)
  spaceUnbindAll()

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

function loadDialogue (dialogue) {
  log(
    'Loading dialogues[' + CURRENT.dialogue + '] in scene id: ' + CURRENT.scene
  )

  //console.log(dialogue)

  show(HTML.nextbutton, HTML.optionsbutton, HTML.menu.panel, HTML.textbox)

  if (dialogueValid(dialogue.conditions)) {
    loadDialogueBackground(dialogue.background)

    loadDialogueCharacters(dialogue.characters, dialogue.speaking)

    loadDialogueText(dialogue.text)

    loadDialogueChoices(dialogue.choices) //blocking

    loadInput(dialogue.input) //blocking

    handleDialogueGoto(dialogue.goto) //not blocking but defining

    handleSpaceBehavior(dialogue)
  } else {
    nextDialogue() //load next dialogue next
  }
}

function handleSpaceBehavior (dialogue) {
  //awaiting user input
  if (dialogue.input || dialogue.choices) {
    spaceUnbindAll()
  } else {
    if (dialogue.goto) {
      spaceAdvances(0, () => {
        nextScene(dialogue.goto)
      }) //space advances to next scene this time
    } else {
      spaceAdvances(1, nextDialogue) //default state -> space goes to next dialogue
    }
  }
}

function dialogueValid (conditions) {
  if (!conditions) {
    log('dialogue has no flags!')
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
    changeBackground(HTML.background, background)
  } else {
    log('dialogue has no background!')

    const scn = currentScene() //use scene background
    changeBackground(HTML.background, scn.background)
  }
}

function loadDialogueText (text) {
  show(HTML.menu.panel)
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
    log('dialogue has no choices!')

    hide(HTML.overlay, HTML.choices)
    show(HTML.nextbutton)
  }
}

function loadInput (dialogueInput) {
  // TODO: name based easter eggs?
  const names = [
    '[Milo]',
    'AM',
    'Zoosmell',
    'Dick Mullen',
    'Jadwiga',
    'Fellow Traveler',
    'Heir',
    'Ebony Way',
    '24601',
    'Paul Allen',
    'Beetlejuice'
  ]

  //user is supposed to input
  if (dialogueInput) {
    hide(HTML.nextbutton) //can only go next after inputting
    display(HTML.inputpanel, 'flex')

    spaceUnbindAll() //no spacing around when typing

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
    log('dialogue has no input values!')
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
      'Hey, ' + input + ' is *my* name!  -' + input.toUpperCase()[0]
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
    log('dialogue has no goto; goto is next dialogue!')
    registerButtonClick(function () {
      nextDialogue()
    })
  }
}

function choiceSetsFlags (choice, button) {
  if (choice.flags) {
    log('setting flags on choice ' + choice.id)

    registerClicks(button, function () {
      setUserFlags(...choice.flags)
    })
  } else {
    log('choice ' + choice.id + ' has no Flags!')
  }
}

function choiceRedirects (choice, button) {
  if (choice.goto) {
    log('setting goto on choice ' + choice.id)

    registerClicks(button, function () {
      nextScene(choice.goto)
    })
  } else {
    log('choice ' + choice.id + ' has no goto; goto is next dialogue.')
    registerClicks(button, function () {
      nextDialogue()
    })
  }
}

// STORY FLOW-------------- -----------------

function nextScene (scene_id = null) {
  spaceUnbindAll() //unbind all - will be rebound if necessary

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
  spaceUnbindAll() //will be rebound if next dialogue needs it
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
  hideAll()
  //next chapter available
  if (Story.chapters[CURRENT.currentChapter + 1]) {
    CURRENT.currentChapter++
    CURRENT.chapter = Story.chapters[CURRENT.currentChapter]
    CURRENT.scene = Story.chapters[CURRENT.currentChapter].scenes[0].id
    CURRENT.dialogue = 0

    initChapter()
  } else {
    show(HTML.textbox)
    show(HTML.menu.panel)
    setTextbox('The End <3')
    //console.log("no more chapters")
  }
}

//INTERACTION AND BUTTONS ------------------------------------------

function setTooltip (element, text) {
  element.title = text
}

//one action per button | button: DOMElement
function registerButtonClick (callback, button = HTML.nextbutton) {
  log('setting what <' + button.id + '> does')

  removeClicks(button)

  //function present => new function for nextbutton
  if (callback) {
    registerClicks(button, callback)
  } else {
    log('<' + button.id + '> does nothing!')
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

  log(
    'new functions (' +
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

  log(
    'new functions (' +
      functions +
      ') registered to element id: ' +
      element.id +
      ' on input!'
  )
}

//space advances dialogue

function spaceAdvances (key, callback) {
  log('defining space bahavior with code: ' + key)
  // Define a wrapper that checks for the 'space' key and executes the callback
  const wrappedCallback = event => {
    if (
      //if last space happened after a time LONGER than cooldown
      Date.now() - CURRENT.spaceHandler.last_space >
      CURRENT.spaceHandler.cooldown
    ) {
      log('space advancing from function: ' + key)

      CURRENT.spaceHandler.last_space = Date.now() //space clicked

      //compat, 229 special code for "IMO" processing
      //i kinda really wanna get into webdev... who knew
      if (
        event.isComposing ||
        event.keyCode === 229 ||
        event.defaultPrevented
      ) {
        return
      }
      // Check if the key is 'space' (key code 32)
      if (event.keyCode === 32) {
        callback()
      }
    }
  }

  CURRENT.spaceHandler.callbacks.set(key, wrappedCallback)

  // Register the wrapped callback as an event listener for 'keydown'
  document.addEventListener('keydown', wrappedCallback)
}

function spaceUnbind (key) {
  // Retrieve the wrapped callback using the key
  const callback = CURRENT.spaceHandler.callbacks.get(key)
  if (callback) {
    // Remove the event listener
    document.removeEventListener('keydown', callback)
    // Remove the entry from the map
    CURRENT.spaceHandler.callbacks.delete(key)
  }
}

function spaceUnbindAll () {
  // Iterate through all callbacks in the map
  CURRENT.spaceHandler.callbacks.forEach((callback, key) => {
    // Remove the event listener for each callback
    document.removeEventListener('keydown', callback)
  })
  // Clear the map after removing all listeners
  CURRENT.spaceHandler.callbacks.clear()
}

//removes all click listeenrs
function removeClicks (element) {
  const e = $(element)

  e.off('click')

  log('clicks unregistered from ' + element.id)
}
function removeInputEvents (element) {
  const e = $(element)

  e.off('input')

  log('inputs unregistered from ' + element.id)
}

// setting user data -----------------

function setUserFlags (...flags) {
  log('Setting Flags on user! [' + flags.join(', ') + ']')
  flags.forEach(flag => {
    if (!PlayerState.flags.includes(flag)) {
      PlayerState.flags.push(flag)
    }
  })
}

function setUserAttribute (attr, value) {
  log('changing user state!')
  if (PlayerState[attr]) {
    log('overwriting existing value: ' + PlayerState[attr] + ' to: ' + value)
  } else {
    log('new player attribute: ' + PlayerState[attr])
  }

  PlayerState[attr] = value
}

//true if user has all the param flags
function userHasFlags (...flags) {
  let hasFlags = true

  flags.forEach(flag => {
    if (!PlayerState.flags.includes(flag)) {
      hasFlags = false
    }
  })

  return hasFlags
}

//SAVING LOADING -----------------------------

function saveNewState (
  chapter = CURRENT.chapter.id,
  scene = CURRENT.scene,
  dialogue = CURRENT.dialogue,
  saveSlot = -1
) {
  log(`Saving game to slot: ${saveSlot}`)
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
    .then(() => log('Game state saved successfully'))
    .catch(error => console.error('Failed to save game state', error))
}

function updateState (id) {
  SaveManager.loadGameState(id).then(gameState => {
    if (!gameState) {
      console.error('Game state not found!')
      return
    }

    // Modify the game state as needed
    gameState.playerState = {
      /* new player state data */
    }
    gameState.timestamp = new Date() // Update the timestamp or any other property

    // Save (update) the game state
    SaveManager.saveGameState(gameState)
      .then(() => log('Game state updated successfully'))
      .catch(error => console.error('Failed to update game state', error))
  })
}

function loadState (id) {
  SaveManager.loadGameState(id)
    .then(state => {
      CURRENT.dialogue = state.coordinates.dialogue_index
      CURRENT.scene = state.coordinates.scene_id
      CURRENT.currentChapter = state.coordinates.chapter_id
      CURRENT.chapter = Story.chapters[state.coordinates.dialogue_index]

      initChapter()
    })
    .catch(error => console.error('Failed to load game state', error))
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

function hideAll () {
  hide(
    HTML.nametag,
    HTML.characters,
    HTML.choices,
    HTML.menu.panel,
    HTML.saves.modal,
    HTML.textbox,
    HTML.nextbutton,
    HTML.optionsbutton,
    HTML.overlay,
    HTML.popup.modal
  )
}

function show (...elements) {
  elements.forEach(element => {
    element.style.visibility = 'visible'
  })
}

function isHidden (element) {
  return (
    element.style.visibility == 'hidden' || element.style.visibility == 'none'
  )
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

function isDisabled (button) {
  return button.classList.contains('disabled')
}
//modals like settings,
function openModal (modal) {
  CURRENT.openModal = modal

  show(modal)
  show(HTML.overlay)
}

function close (modal) {
  CURRENT.openModal = null
  hide(modal)
  hide(HTML.overlay)
}

function toggle (to_close, to_open) {
  close(to_close)
  openModal(to_open)
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
  const menuitems = HTML.menu.panel.querySelectorAll(
    '.dddsim-talkbox-menu-item'
  )

  menuitems.forEach(button => {
    disableButton(button)
  })
}

function enableMenu () {
  const menuitems = HTML.menu.panel.querySelectorAll(
    '.dddsim-talkbox-menu-item'
  )

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

function log (text) {
  console.log('LOG:' + text)
}

const DEBUG = {
  currentDialogue: () => {
    let scene = currentScene()

    return scene.dialogue[CURRENT.dialogue]
  }
}
