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
        regex: /^chapter+\s*\w+\s*is*$/,
        expectedChildren: ['attributes.valueIs', 'blocks.scene']
      },
      scene: {
        regex: /^scene+\s*\w+\s*is*$/,
        expectedChildren: ['attributes.valueIs', 'dialogue', 'actions', 'flow']
      }
    },
    flow: {
      if: {
        regex: /^if\s+\w+(\s+(?:and|or)\s+\w+)*$/,
        expectedChildren: ['actions', 'dialogue']
      }
    },
    attributes: {
      valueIs: {
        regex: /^\s*(\w+)\s+is\s+((?:\w+\s*)+)$/,
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
      regex: /^\s*\w+\s*:\s*[^:\s].*$/,
      expectedChildren: ['attributes.choice']
    },
    actions: {
      show: {
        regex:
          /^show\s+([\w]+\s*(?:\s[\w]+)?\s*(?:,\s*[\w]+\s*(?:\s[\w]+)?\s*)*)$/,
        expectedChildren: null
      },
      hide: {
        regex: /^hide\s+\w+(\s*,\s*\w+)*$/,
        expectedChildren: null
      },
      go: {
        regex: /^go\s+(\w+)$/,
        expectedChildren: null
      },
      set: {
        regex: /^set\s+\w+(\s*,\s*\w+)*$/,
        expectedChildren: null
      },
      input: {
        regex: /^\s*input\s+into\s+(\w+.\w+)+$/,
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

  const outData = {}

  //all lines sanitized
  const lines = init(text)

  parseCharacters(lines)
  parseChapters(lines)

  //console.log(JSON.stringify(outData))

  // console.log(JSON.stringify(references))

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
        character['sprites'] = {}
        sprites
          .map(s => s.toLowerCase())
          .forEach(sprite => {
            character.sprites[
              sprite
            ] = `${characterssrc}${name.toLowerCase()}/${sprite}.png`
          })
        let defaultsprite = raw.attr.defaultemotion

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
    characterDataOut['Player'] = {
      name: 'placeholder',
      sprites: null
    }

    characterDataOut['Narrator'] = {
      name: 'Narrator',
      sprites: null
    }

    setOutput('characters', characterDataOut)

    //console.log(lines)

    //const characterBlocks = getBlocks(lines, ...characterLines);
  }

  function makeCharacter (line) {
    const block = getRawBlock(line)

    const id = regexFromLine(block[0], patterns.blocks.character.regex)[1] //second is first aka onlymatch
    //all remainaining lines

    const attributes = {}
    //all valid character sublock lines are attributes
    block.slice(1).forEach(attr => {
      const kv = parseAttribute(attr) //TODO: isValidSubblock validation or something

      attributes[kv[0]] = kv[1]
    })

    return {
      id: id,
      attr: attributes
    }
  }

  function parseChapters (lines = []) {
    //make references from
    const characterDataIn = lines
      .filter(line => line.indent == 0) //chapters are always level 0
      .filter(line => line.type === 'chapter') //needs to be a chapter block
      //assign chapters to be parsed into scenes
      .map(line => {
        //console.log(line)
        let scenes = makeScenes(line) //make scenes belonging to this chapter

        // let currentChapter = makeChapter(scenes) //[id, attr, scenes]
        //  setReference('chapters', currentChapter.id, currentChapter.attr)

        return line // currentChapter
      })

    const characterDataOut = characterDataIn.map(character => {
      //  let title = character.attr.title
      //let id = character.attr.id
    })

    //setOutput('chapters', characterDataOut)
  }

  function makeChapter (line, scenes) {}

  //returns array of scenes {id, attr, dialogues}
  function makeScenes (line) {
    //console.log(line)
    const rawChapterBlock = getRawBlock(line) //chapter as lines
    const scenes = getRawChildBlocks(rawChapterBlock).map(scene =>
      makeScene(scene)
    )

    //console.log(rawChapterBlock)

    return scenes
  }

  function makeScene (sceneLines) {
    // console.log(sceneLines)
    const id = regexFromLine(sceneLines[0], patterns.blocks.scene.regex)[1]
    const children = sceneLines.slice(1)

    const scene = { id: '', attr: {}, dialogue: [] } //output

    const attributes = {}

    children.forEach(line => {
      if (isAttribute(line)) {
        const kv = parseAttribute(line) //TODO: isValidSubblock validation or something

        scene.attr[kv[0]] = kv[1]
      }
    })

    console.log(scene)

    return scene
  }

  function regexFromLine (line, regex) {
    return line.text.split(regex)
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

    compileError('notKnownPattern', line.fileLine)
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

  //type: char, id: char, infor: {}
  function setReference (type, id, info) {
    if (type && id && info) {
      if (!references[type.toLowerCase()]) {
        references[type.toLowerCase()] = {}
      }

      references[type.toLowerCase()][id] = info
      //TODO: id restricted words etc etc
    } else throw Error('compiler doesnt know what the reference is its setting')

    //console.log(references)
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
        messages.push(`Unrecognized pattern for`)

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
