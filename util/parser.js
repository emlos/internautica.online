const fs = require('fs')
const path = require('path')
const util = require('./readfiles')

const targetGamedata = require('../src/_data/projects/dddsim/gamedata')
const targetChaptersdata = require('../src/_data/projects/dddsim/chapters')

const characterssrc = '/images/projects/dddsim/characters/' //TODO: cleanup for 1.0
const backgroundsrc = '/images/projects/dddsim/backgrounds/'

const arguments = process.argv // [node, parser.js, [operator: parse, make], <fromfile>, <tofile>]

const chaptersDataFile = join('chapter.test.js')
const gameDataFile = join('gamedata.test.js')

const outputFolder = join() //chapters.js gamedata.js

const scriptsPath = join('', '../projects/dddsim/scripts/')

const scripts = fs
  .readdirSync(scriptsPath)
  .filter(script => script.endsWith('.script'))

//read scripts
scripts.forEach(script => {
  const scriptContent = fs
    .readFileSync(path.join(scriptsPath, script))
    .toString()

  parse(scriptContent)
})

//TODO
function save (parser, script, outputDir) {
  fs.writeFileSync('myParser.js', parser.parse)
}
//done
function join (filepath = '', data = '../src/_data/projects/dddsim/') {
  return path.join(__dirname, data, filepath)
}

//-------------------------------------------------------------------------------

function parse (text) {
  const patterns = {
    blocks: {
      character: {
        regex: /^character\s*(\w+)\s*is+$/,
        expectedChildren: ['attributes.valueIs', 'attributes.valuesAre']
      },
      chapter: {
        regex: /^chapter+\s*(\w+)\s*is*$/,
        expectedChildren: ['attributes.valueIs', 'blocks.scene']
      },
      scene: {
        regex: /^scene+\s*(\w+)\s*is*$/,
        expectedChildren: ['attributes.valueIs', 'dialogue', 'actions', 'flow']
      }
    },
    flow: {
      if: {
        regex: /^if\s+(\w+)*$/,
        expectedChildren: ['actions', 'dialogue']
      }
    },
    attributes: {
      valueIs: {
        regex: /^\s*(\w+)\s+is\s+(.+)$/,
        expectedChildren: null
      },
      valuesAre: {
        regex: /^\s*(\w+)\s+are\s+((\w+\s*,\s*)*\w+)\s*$/,
        expectedChildren: null
      },
      //special case of valueIs attribute, onli in scenes
      choice: {
        regex: /\s*choice+\s+is\s+(.*)$/,
        expectedChildren: ['actions']
      }
    },
    dialogue: {
      regex: /^\s*(\w+)\s*:\s+(.+)$/,
      expectedChildren: ['attributes.choice']
    },
    actions: {
      show: {
        regex:
          /^show\s+([\w]+\s*(?:\s[\w]+)?\s*(?:,\s*[\w]+\s*(?:\s[\w]+)?\s*)*)$/,
        expectedChildren: null
      },
      hide: {
        regex:
          /^hide\s+([\w]+\s*(?:\s[\w]+)?\s*(?:,\s*[\w]+\s*(?:\s[\w]+)?\s*)*)$/,
        expectedChildren: null
      },
      go: {
        regex: /^go\s+(\w+)$/,
        expectedChildren: null
      },
      set: {
        regex:
          /^set\s+([\w]+\s*(?:\s[\w]+)?\s*(?:,\s*[\w]+\s*(?:\s[\w]+)?\s*)*)$/,
        expectedChildren: null
      },
      input: {
        regex: /^input\s+into\s+(\w+)$/,
        expectedChildren: null
      }
    }
  }

  //variables inside script, scene names, characters
  const references = {
    scenes: {},
    chapters: {},
    characters: {}
  }

  //allowed to be referenced?
  const outData = {}

  //all lines sanitized
  const lines = init(text)

  parseCharacters(lines)
  parseChapters(lines)

   console.log(JSON.stringify(outData))

  //console.log(JSON.stringify(references))

  //helper functions--------------------------------------------------------------------------

  //done
  function init (text) {
    //normalize text

    const lines = text
      .split('\n')
      .map((line, index) => {
        let linetext = line.replace(/#.*$/g, '').trim()

        //map out every line to FILE line nr !important
        return {
          fileLine: index + 1,
          indent: getIndent(line),
          text: linetext //remove comments
        }
      })
      .filter(line => line.text.trim()) //filter out empty lines
      .map((line, index) => {
        line.type = getPatternType(line)
        line.index = index
        return line
      }) //normalise

    //make global objects:  Narrator, player, source folder

    setReference('characters', 'N', { name: 'Narrator', sprites: null })
    setReference('characters', 'P', { name: 'Player', sprites: null })
    references['source'] = '/images/projects/dddsim/'

    return lines
  }

  //TODO: by god make this code Better
  //DONE otherwise
  function parseCharacters (lines = []) {
    const characterDataOut = {}

    // console.log(lines)

    //make references from
    const characterDataIn = lines
      .filter(line => line.indent == 0) //characters are always level 0
      .filter(line => line.type === 'character') //needs to be character block
      //assign blocks to be parsed into json
      .map(line => {
        let character = makeCharacter(line)

        let sprites = {}

        character.attr.sprites
          .map(s => s.toLowerCase())
          .forEach(sprite => {
            //  console.log(`${characterssrc}${character.attr.name.toLowerCase()}/${sprite}.png`)
            sprites[
              sprite
            ] = `${characterssrc}${character.attr.name.toLowerCase()}/${sprite}.png`
          })

        character.attr.sprites = sprites
        // console.log(character.attr.sprites)

        setReference('characters', character.id, character.attr)
        return character
      }) //extract info in json

    //build sprites etc
    characterDataIn.forEach(raw => {
      let character = {}
      let name = capt(raw.attr.name) //name is required for characters
      let sprites = raw.attr.sprites

      character['name'] = name //required

      //explicitly set to null if sprites not present
      if (sprites) {
        character['sprites'] = raw.attr.sprites
        let defaultsprite = `${characterssrc}${name}/${raw.attr.defaultemotion}.png`

        //defaultemotion specified
        if (defaultsprite) {
          character.sprites['default'] = character.sprites[defaultsprite] //same as existing emotion
        }
        //first in sprites as default
        else {
          character.sprites['default'] = Object.values(character.sprites)[0]
        }
      } else {
        character['sprites'] = null
      }

      characterDataOut[name] = character
    })

    //narrator and player always availabale in out code

    setOutput('characters', characterDataOut)

    //const characterBlocks = getBlocks(lines, ...characterLines);
  }

  function makeCharacter (line) {
    const block = getRawBlock(line)

    const id = parseBlockId(block[0], patterns.blocks.character.regex) //second is first aka onlymatch
    //all remainaining lines

    const attributes = {}
    //all valid character sublock lines are attributes
    block.slice(1).forEach(attr => {
      const kv = parseAttribute(attr) //TODO: isValidSubblock validation or something

      const key = kv[0]
      const value = kv[1]

      attributes[key] = value
    })

    return {
      id: id,
      attr: attributes
    }
  }

  function parseChapters (lines = []) {
    //make references from
    const chaptersData = lines
      .filter(line => line.indent == 0) //chapters are always level 0
      .filter(line => line.type === 'chapter') //needs to be a chapter block
      //assign chapters to be parsed into scenes
      .map(line => {
        let currentChapter = {
          scenes: [],
          id: '',
          order: -1,
          title: '',
          start: ''
        }

        //cosole
        let scenes = makeScenes(line) //make scenes belonging to this chapter
        currentChapter.scenes = scenes

        let id = parseBlockId(line, patterns.blocks.chapter.regex)
        currentChapter.id = id

        let attr = getRawBlock(line)
        let expectedIndent = attr[1].indent
        //console.log(attr)
        attr = attr.filter(l => isAttribute(l) && l.indent == expectedIndent)

        attr.forEach(a => {
          // console.log(a)
          const parsed = parseAttribute(a)
          const at = parsed[0]
          const value = parsed[1]

          currentChapter[at] = value
        })

        if (!currentChapter['start']) {
          currentChapter['start'] = scenes[0].id
        }
        //console.log(currentChapter)
        // setReference('chapters', currentChapter.id, currentChapter.attr)

        return currentChapter // currentChapter
      })

    // console.log(chaptersData)

    setOutput('chapters', chaptersData)
  }

  //returns array of scenes {id, attr, dialogues}
  function makeScenes (line) {
    const parent = parseBlockId(line, patterns.blocks.chapter.regex)

    const rawChapterBlock = getRawBlock(line) //chapter as lines
    const scenes = getRawChildBlocks(rawChapterBlock).map(scene =>
      //  console.log(scene)
      makeScene(scene, parent)
    )

    return scenes
  }

  function makeScene (sceneLines = [], parentId) {
    const id = parseBlockId(sceneLines[0], patterns.blocks.scene.regex)
    const children = sceneLines.slice(1)

    const scene = { id: id, dialogues: [], parentChapter: parentId } //output

    //attributes of scene ============
    let attrs = true // lazy workaround for having the attribures be the first thing ever
    children.forEach(line => {
      const type = line.type

      if (attrs && isAttribute(line)) {
        const kv = parseAttribute(line)
        const key = kv[0]
        let value = kv[1]

        if (key.toLowerCase() == 'background') {
          value = backgroundsrc + value
        }

        scene[key] = value
      } else {
        attrs = false
      }
    })

    //required attrs

    if (!scene['background']) {
      scene['background'] = null
    }

    if (!scene['order']) {
      //TODO: ordering algorithm
    }

    //dialogue of scene -----------=====================================

    scene.dialogues = makeDialogue(sceneLines)

    //	console.log(scene);

    return scene
  }

  function makeDialogue (sceneLines = []) {
    const firstDialogueStartIndex = sceneLines.findIndex(
      line => line.type == 'dialogue'
    )

    const rawLines = sceneLines.slice(firstDialogueStartIndex) //lines are just all dialogue

    const dialogue = makeDialogueLines(rawLines)

    //console.log(rawLines)

    return dialogue
  }

  function makeDialogueLines (lines = []) {
    // console.log(lines)
    const dialogueTemplate = {
      text: '',
      speaking: '',
      characters: null,
      input: null,
      choices: null,
      background: null,
      conditions: null, //required for dialogue shown
      flags: null, //set when dialogue shown
      goto: null
    }

    const dialogues = [] //dinal array

    var dialogue = null
    const status = {
      currentLine: 0,
      baseIndent: -1,
      //runtime
      choices: [],
      currentChoice: {},
      showing: [], //characters on screen
      background: null, //current bg
      conditions: [], //in how many ifs you are, idex: 'condition'
      inChoice: false,
      inIf: false
    }

    //whatever idgaf this needs to get DONE
    while (true) {
      let line = lines[status.currentLine]
      //	console.log(line);

      switch (line.type) {
        case 'dialogue':
          //1. start fresh
          if (dialogue) {
            //finish prev choice to be with rpevious dialogue
            if (status.inChoice) dialogue.choices.push(status.currentChoice)
            dialogues.push(dialogue)
          }
          dialogue = structuredClone(dialogueTemplate)
          dialogue.characters = []
          //2. set previously queued data
          //shown characters from previous line (cheezy)

          status.showing.forEach(ref => {
            let character = getReference('characters', ref)
            dialogue.characters.push(character)
          })
          //prev background if set
          dialogue.background = status.background

          //3. get new data
          let diag = parseDialogue(line)
          let speaker = diag[0]
          let text = diag[1]

          dialogue.text = text

          //4. apply conditions
          if (line.indent == status.baseIndent) {
            //no ident means its choice
            status.inIf = false
            status.conditions = []
          }
          if (!status.inIf) status.baseIndent = line.indent

          if (status.inIf) dialogue.conditions = status.conditions.slice(0)
          dialogue.speaking = getReference('characters', speaker).name

          status.inChoice = false
          status.currentChoice = null
          status.currentLine++
          break

        case 'show':
          if (!status.inChoice) {
            let toShow = parseDialogue(line)[0]
            //reson for doing this in this order: things happen like the script writer expects ig to
            //add new characters
            toShow.forEach(ref => {
              //duplicates
              if (!status.showing.includes(ref)) {
                status.showing.push(ref)
              }
            })
            //  console.log(line)
          }
          status.currentLine++
          break

        case 'hide':
          if (!status.inChoice) {
            let toHide = parseDialogue(line)[0]

            //remove values to hide
            toHide.forEach(ref => {
              let i = status.showing.indexOf(ref)

              if (i > -1) status.showing.splice(i, 1)
            })
          }
          status.currentLine++
          break

        case 'go':
          let destination = parseDialogue(line)[0][0]
          if (!status.inChoice) {
            dialogue.goto = destination
          } else {
            status.currentChoice.goto = destination
          }
          status.currentLine++
          break

        case 'valueIs':
          if (!status.inChoice) {
            let parsed = parseAttribute(line)
            let attr = parsed[0]
            let value = parsed[1]

            if (attr.toLowerCase() == 'background') {
              if (value == 'none') status.background = null
              else status.background = backgroundsrc + value
            }
          }

          status.currentLine++
          break

        case 'set':
          let flags = parseDialogue(line)[0]
          if (!status.inChoice) {
            dialogue.flags = flags
          } else {
            status.currentChoice.flags = flags
          }
          status.currentLine++
          break

        case 'input':
          if (!status.inChoice) {
            let input = parseDialogue(line)[0][0]
            dialogue.input = input
          }
          status.currentLine++
          break

        case 'choice':
          //means previous choice is done
          if (status.inChoice) {
            if (!dialogue.choices) dialogue.choices = []
            dialogue.choices.push(status.currentChoice)
          }

          status.inChoice = true

          let choice = {
            text: '',
            flags: [],
            goto: ''
          }

          let choiceText = parseDialogue(line)[0][0]
          choice.text = choiceText

          status.currentChoice = choice
          status.currentLine++
          break

        case 'if':
          //unavalable inchoice
          //finish up choices, and set up for following to be in if
          if (status.inChoice) {
            if (!dialogue.choices) dialogue.choices = []
            dialogue.choices.push(status.currentChoice)
            status.inChoice = false
          }

          status.inIf = true

          let flag = parseDialogue(line)[0]
          status.conditions = [flag]

          status.currentLine++
          break

        default:
          status.currentLine++
      }

      //   console.log(status)

      //cleanup
      //if last dialogue
      if (status.currentLine == lines.length) {
        //missing gotos
        if (!dialogue.goto) dialogue.goto = 'end'

        //final visible/invisible characters
        status.showing.forEach(ref => {
          let character = getReference('characters', ref)
          //		dialogue.characters.push(character);
        })

        if (status.currentChoice && status.inChoice) {
          if (!dialogue.choices) dialogue.choices = []
          dialogue.choices.push(status.currentChoice)
        }

        //background
        dialogue.background = status.background

        //final dialogue push
        dialogues.push(dialogue)

        //end loop
        break
      }
    }

    dialogues.forEach(d => {
      //console.log(d.text)
     // console.log(d.conditions)
    })

    // console.log(dialogues)
    //  console.log(lines)

    return dialogues
  }

  //done
  function parseBlockId (line, regex) {
    const text = line.text.toLowerCase()

    const match = text.match(regex).slice(1, 2)[0]

    return match
  }

  //done
  function getIndent (line) {
    const indents = line.match(/^(\s*)/) // Matches leading spaces
    return indents ? indents[0].length : 0
  }

  //line is init lineobject
  //done
  function getPatternType (line) {
    text = line.text.toLowerCase()

    if (_isBlock(text, 'character')) {
      return 'character'
    }
    if (_isBlock(text, 'scene')) return 'scene'
    if (_isBlock(text, 'chapter')) return 'chapter'

    if (_isAction(text, 'show')) return 'show'
    if (_isAction(text, 'hide')) return 'hide'
    if (_isAction(text, 'go')) return 'go'
    if (_isAction(text, 'set')) return 'set'
    if (_isAction(text, 'input')) return 'input'

    if (_isAttribute(text, 'choice')) return 'choice'
    if (_isAttribute(text, 'valueIs')) return 'valueIs'
    if (_isAttribute(text, 'valuesAre')) return 'valuesAre'

    if (_isFlow(text, 'if')) return 'if'

    if (_isDialogue(text)) return 'dialogue'

    compileError('notKnownPattern', line)
  }

  //dialogue AND actions AND choice AND
  function isDialogue (line) {
    const type = line.type

    return (
      type == 'dialogue' || isFlow(line) || isAction(line) || type == 'choice'
    )
  }

  function parseDialogue (line) {
    const text = line.text.trim()
    const type = line.type
    let regex = false

    if (type == 'dialogue') regex = patterns.dialogue.regex
    if (type == 'choice') regex = patterns.attributes.choice.regex
    if (patterns.actions[line.type]) regex = patterns.actions[line.type].regex
    if (patterns.flow[line.type]) regex = patterns.flow[line.type].regex

    if (!regex) {
      console.log(line)
      throw Error('cant match dialogue!')
    }

    if (regex.test(text)) {
      const match = text
        .match(regex)
        .slice(1) // [string, ...matches] -> [...matches]
        .filter(m => m)
        .map(m => m.trim())

      if (type == 'dialogue' || type == 'if') {
        //TODO: check if character exists in references
      } else {
        //return the parameters
        match[0] = match[0]
          .split(',')
          .filter(match => match)
          .map(m => m.trim())

        //if (match[0].length == 1) match[0] = match[0][0]
      }

      match.slice(0, 2) //cleanup

      //console.log(match)

      return match
    }
  }

  //done
  function isAttribute (line) {
    return Object.keys(patterns.attributes).includes(line.type)
  }

  function parseAttribute (line) {
    // console.log(line)
    const text = line.text.trim()

    const regex = patterns.attributes[line.type].regex //ading type made this SO much easier holy shit

    if (regex && regex.test(text)) {
      const match = text
        .match(regex)
        .slice(1)
        .filter(m => m)

      if (line.type == 'choice') {
        match[1] = match[0]

        match[0] = 'choice'
      } else {
        match[0] = match[0].trim() //first match is always variable name... or
        match[1] = match[1].split(',').map(m => m.trim())
      }

      //if its NOT an array
      if (match[1].length == 1 && line.type !== 'valuesAre') {
        match[1] = match[1][0] //[element] -> element
      }

      match.slice(0, 2) //everything else after the second one doesnt onterest us for attributes

      return match
    }

    let result = false
    Object.keys(patterns.attributes).forEach(key => {
      let attr = patterns.attributes[key]

      //you can get both first and second part of the attr
      if (!result && attr.regex.test(text)) {
        if (key == 'valuesAre') {
          //is list
          const values = text.match(attr.regex).slice(1, -1)
          values[1] = values[1].split(',').map(listitem => listitem.trim())

          result = values
          //is singlr value
        } else {
          result = text.match(attr.regex).slice(1) //pop the first element off since its just the whole captured string
        }
      }
    })

    if (!result) {
      //compileError()
      throw Error('line "' + text + '" is not an attribute!')
    }

    return result
  }

  //done
  function isFlow (line) {
    return Object.keys(patterns.flow).includes(line.type)
  }

  //done
  function isAction (line) {
    return Object.keys(patterns.actions).includes(line.type)
  }

  //done 100%
  function isBlock (line) {
    return Object.keys(patterns.blocks).includes(line.type)
  }

  function parseBlock (line) {
    const text = line.text
    const regex = patterns.blocks[line.type]

    if (regex && regex.test(text)) {
      const match = text
        .match(regex)
        .slice(1)
        .filter(m => m)
    } else {
      throw Error(
        `"${line.text}" of type "${line.type}" did not match ${regex}`
      )
    }
  }

  function isValidSubblock (line, type) {
    let allowed = type.expectedChildren.map(child =>
      child
        .split('.')
        .map(child => child.trim())
        .filter(child => child)
    )

    allowed.forEach(path => {
      let line_type = getPatternType('line')
      if (line_type) {
      }
    })
  }

  //================================= util functions

  //returns: [lines as below, belonging to startBlock line indented block]
  // first line is always the head of the block, index is based on first indented line
  //error on wrong input :)
  //{ fileLine: 0, indent: 0, text: 'character d is', index: 0 } -> nextBlockLine,  startLine required
  function getRawBlock (startLine) {
    let result = []

    //slice lines from startBlock to endBlock
    {
      let nextLine = lines[startLine.index + 1] //next line relative to start

      if (nextLine) {
        //whatever state state: single line block retrns itself
        if (nextLine.indent == startLine.indent) {
          //exit
          compileError('emptyBlock', startLine)
        }

        //error state: trying to get block from a nonheader
        else if (nextLine.indent < startLine.indent) {
          //console.log(startLinet
          compileError('wrongIndent', nextLine, ' < ' + startLine.indent)
        }
        // = is nextline.indent > startline.index
        else {
          let firstBlock = true //TODO: this is such a bad solution but im high and i wanna be done with this
          let indentedBlock = lines.slice(nextLine.index).filter(line => {
            //
            if (firstBlock && line.indent >= nextLine.indent) {
              return true
            } else {
              firstBlock = false
              return false
            }
          })

          result = [startLine].concat(indentedBlock)
        }
      } else {
        console.log('lastline getRawBlock!')
      }
    }

    return result
  }

  //abovefunction hint hint
  //results in array of arrays of lines
  function getRawChildBlocks (rawblock = []) {
    //array of arrays
    const childBlocks = []

    //start
    const parentRaw = rawblock[0]
    //console.log(rawblock)

    const childrenRaw = rawblock.slice(1)

    //cant have empty chapters... and peace of mind

    const baseIndent = parentRaw.indent //base indent
    const blockIndent = childrenRaw[0].indent //expecte indent of rest of block

    childrenRaw.forEach(current => {
      //if current is block - nice
      if (isBlock(current) && current.indent == blockIndent) {
        childBlocks.push(getRawBlock(current))
      }
    })

    // console.log(`${parentRaw.type} has `)

    //console.log(childBlocks.length)
    return childBlocks
  }

  //sets json t
  function setOutput (filename, contents) {
    outData[filename] = contents

    //console.log(outData)
  }

  function getOutput (filename) {
    return outData[filename]
  }

  //type: char, id: char, infor: {}
  function setReference (type, id, value) {
    if (type && id && value) {
      if (!references[type.toLowerCase()]) {
        references[type.toLowerCase()] = {}
      }

      //TODO: pass line object too? if(references[type.toLowerCase()][id]) compileError("duplicate reference")
      references[type.toLowerCase()][id] = value
      //TODO: id restricted words etc etc
    } else throw Error('compiler doesnt know what the reference is its setting')

    //console.log(references)
  }

  function getReference (type, id) {
    // console.log(id)
    if (references[type]) {
      if (references[type][id]) {
        return references[type][id]
      } else {
        console.log('cant access reference: no id: ' + id)
        //compileError('badReference') todo as above
      }
    } else {
      console.log('cant access reference: no type: ' + type)
      //compileError('badReference') todo as above
    }
  }

  //use when the USER wrote the script wrong
  function compileError (type, line, ...info) {
    const errorLine = line.fileLine
    const causingLine = line.text
    const messages = [
      `Error when compiling on script line: ${errorLine}: "${causingLine}"`
    ]
    //types: match, invalidCharacters, redeclarationScene, redeclarationChapter, ,
    switch (type) {
      case 'notKnownPattern':
        messages.push(`Line "${causingLine}" doesn't match any pattern!`)

        break
      case 'requiredAttr':
        messages.push(`Attributte ${info[0]} is required for type ${line.type}`)
        break

      case 'emptyBlock':
        messages.push(`Block "${line.type}" can't be empty!`)
        break

      case 'wrongIndent':
        messages.push(
          `Wrong Indentation! Expected: ${info[0]}, Got: ${line.indent}`
        )

      default:
        break
    }

    messages.push('\n')

    throw new Error(messages.join('\n'))
  }

  //DO NOT USE OR MOIFY ------------------------------------- use line.type instead <= bad practice whatever

  // --------------=============================== validation functions

  //done
  function _isDialogue (line) {
    return patterns.dialogue.regex.test(line)
  }

  function _isAction (line, type = false) {
    let matches = false

    if (type) {
      if (patterns.actions[type].regex.test(line)) {
        matches = true
      }
    } else {
      Object.keys(patterns.actions).forEach(key => {
        let attr = patterns.actions[key]

        if (attr.regex.test(line.text)) {
          matches = true
        }
      })
    }
    return matches
  }

  function _isAttribute (line, type = false) {
    let matches = false

    if (type) {
      matches = patterns.attributes[type].regex.test(line)
    } else {
      Object.keys(patterns.attributes).forEach(key => {
        let attr = patterns.attributes[key]

        if (attr.regex.test(line.text)) {
          matches = true
        }
      })
    }
    return matches
  }
  function _isFlow (line, type = false) {
    let matches = false

    if (type) {
      matches = patterns.flow[type].regex.test(line)
    } else {
      Object.keys(patterns.flow).forEach(key => {
        let attr = patterns.flow[key]

        if (attr.regex.test(line.text)) {
          matches = true
        }
      })
    }
    return matches
  }

  //type is patterns.blocks etc object of parent
  function _isBlock (line, type = false) {
    let matches = false

    if (type) {
      matches = patterns.blocks[type].regex.test(line)
    } else {
      Object.keys(patterns.blocks).forEach(key => {
        let block = patterns.blocks[key]

        if (block.regex.test(line.text)) {
          matches = true
        }
      })
    }
    return matches
  }
}
// Function to parse the custom text format
function parseTextToJSON (text) {
  const lines = text.split('\n')

  const main = {}

  getBlocks(lines).forEach(block => {})

  const Characters = {}
  let currentCharacter = null
  let currentProperty = null

  lines.forEach(line => {
    line = line.split('#')[0].trim() // Remove comments and trim whitespace

    if (line.startsWith('Character')) {
      const characterName = line.match(/\[([^\]]+)\]/)[1]
      currentCharacter = characterName
      Characters[currentCharacter] = {}
    } else if (line.includes('is')) {
      const [property, value] = line
        .split('is')
        .map(s => s.trim().replace(/\[|\]/g, ''))
      if (property === 'sprites') {
        currentProperty = 'sprites'
        Characters[currentCharacter][currentProperty] = {}
      } else if (currentProperty === 'sprites') {
        const spriteNames = value.split(',').map(s => s.trim())
        spriteNames.forEach(sprite => {
          Characters[currentCharacter][currentProperty][
            sprite
          ] = `${Characters[currentCharacter].name}/${sprite}.png`
        })
        currentProperty = null // Reset after parsing sprites
      } else {
        Characters[currentCharacter][property] = isNaN(Number(value))
          ? value
          : Number(value)
      }
    }
  })

  return Characters
}

//from string to String
function capt (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

//ignore this idgaf anympre
function getDialogueBlocks (arr) {
  const result = []
  let temp = []

  arr.forEach(item => {
    // Check if the current item is a 'dialogue'
    if (item.type === 'dialogue') {
      // If temp is not empty, push it to result (except for the first encounter)
      if (temp.length > 0) {
        result.push(temp)
      }
      // Start a new temp array including the current 'dialogue' item
      temp = [item]
    } else {
      // For non-'dialogue' items, just add them to the current temp
      temp.push(item)
    }
  })

  // After the loop, push any remaining items to result
  if (temp.length > 0) {
    result.push(temp)
  }

  return result
}
