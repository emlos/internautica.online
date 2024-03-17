const fs = require('fs')
const path = require('path')
const util = require('./readfiles')

const targetGamedata = require('../src/_data/projects/dddsim/gamedata')
const targetChaptersdata = require('../src/_data/projects/dddsim/chapters')

const characterssrc = '/images/projects/dddsim/characters/' //TODO: cleanup for 1.0

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
    attibutes: {
      valueIs: {
        regex: /^\s*(\w+)\s+is\s+(\w+)$/,
        expectedChildren: null
      },
      valuesAre: {
        regex: /^\s*(\w+)\s+are\s+((\w+\s*,\s*)*\w+)\s*$/,
        expectedChildren: null
      },
      choice: {
        regex: /^\s*choice+\s+is+$/,
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
        regex: /^go\s+\w+$/,
        expectedChildren: null
      },
      set: {
        regex: /^set\s+\w+(\s*,\s*\w+)*$/,
        expectedChildren: null
      }
    }
  }

  const keywords = ['is', 'are', 'character', 'chapter', 'scene']

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

  parseChapters()

  console.log(references)

  //helper functions--------------------------------------------------------------------------

  //done 1 todo left
  function init (text) {
    //normalize text

    const lines = text
      .split('\n')
      .map((line, index) => {
        //map out every line to FILE line nr !important
        return {
          fileLine: index + 1,
          indent: getIndent(line),
          text: line.replace(/#.*$/g, '').trim() //remove comments
        }
      })
      .filter(line => line.text.trim()) //filter out empty lines
      .map((line, index) => {
        line.text = isDialogue(line.text) ? line.text : line.text.toLowerCase()
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

    //make references from
    const characterDataIn = lines
      .filter(line => line.indent == 0) //characters are always level 0
      .filter(line => isBlock(line.text, 'character')) //needs to be character block
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

    characterDataOut['Player'] = {
      name: 'placeholder',
      sprites: null
    }

    characterDataOut['Narrator'] = {
      name: 'Narrator',
      sprites: null
    }

    setOutput('characters', characterDataOut)

    //const characterBlocks = getBlocks(lines, ...characterLines);
  }

  function makeCharacter (line) {
    const block = getRawBlock(line)

    const id = regexFromLine(block[0], patterns.blocks.character.regex)[1] //second is first aka onlymatch
    //all remainaining lines

    const attributes = {}

    block.slice(1).forEach(attr => {
      const kv = parseAttribute(attr) //TODO: isValidSubblock validation or something

      attributes[kv[0]] = kv[1]
    })

    return {
      id: id,
      attr: attributes
    }
  }

  function regexFromLine (line, regex) {
    return line.text.split(regex)
  }

  function formatCharacterData (characters = []) {}

  //done
  function getIndent (line) {
    const indents = line.match(/^(\s*)/) // Matches leading spaces
    return indents ? indents[0].length : 0
  }

  //not ddone
  function getBlocks (lines = [], ...start) {}

  //done-ish
  function removeComments (text) {
    //1.remove block commoents. 2. remove trailing spaces, 3. remove line comments

    const rawtext = text
    return rawtext
  }

  //line is init lineobject
  function getPatternType (line) {
    const text = line.text

    patterns.flow

    if (isBlock(text, 'character')) {
      return 'character'
    }
    if (isBlock(text, 'scene')) return 'scene'
    if (isBlock(text, 'chapter')) return 'chapter'

    if (isAction(text, 'show')) return 'show'
    if (isAction(text, 'hide')) return 'hide'
    if (isAction(text, 'go')) return 'go'
    if (isAction(text, 'set')) return 'set'

    if (isAttribute(text, 'valueIs')) return 'valueIs'
    if (isAttribute(text, 'valuesAre')) return 'valuesAre'
    if (isAttribute(text, 'choice')) return 'choice'

    if (ifFlow(text, 'if')) return 'if'

    if (isDialogue(text)) return 'dialogue'
  }

  //done
  function isDialogue (line) {
    return patterns.dialogue.regex.test(line)
  }

  function isChoice (line) {
    return patterns.attibutes.choice.test(line)
  }

  function isAction (line) {}

  function isAttribute (line, type = false) {
    let matches = false

    if (type) {
      matches = patterns.attibutes[type].regex.test(line)
    } else {
      Object.keys(patterns.attibutes).forEach(key => {
        let attr = patterns.attibutes[key]

        if (attr.regex.test(line.text)) {
          matches = true
        }
      })
    }
    return matches
  }

  function parseAttribute (line) {
    const text = line.text

    let result = false
    Object.keys(patterns.attibutes).forEach(key => {
      let attr = patterns.attibutes[key]

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

  //type is patterns.blocks etc object of parent
  function isBlock (line, type = false) {
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

  function isValidSubblock (line, type) {
    let allowed = type.expectedChildren.map(child =>
      child
        .split('.')
        .map(child => child.trim())
        .filter(child => child)
    )

    //console.log(allowed)

    allowed.forEach(path => {
      let line_type = getPatternType('line')
      if (line_type) {
      }
    })
  }

  //returns: [lines as below, belonging to startBlock line indented block]
  // first line is always the head of the block, index is based on first indented line
  //error on wrong input :)
  //{ fileLine: 0, indent: 0, text: 'character d is', index: 0 } -> nextBlockLine,  startLine required
  function getRawBlock (startLine, nextBlockLine) {
    let result = []

    //slice lines from startBlock to endBlock
    if (nextBlockLine) {
      result = lines.slice(startLine.index, nextBlockLine.index) //exit
    } else {
      let nextLine = lines[startLine.index + 1] //next line relative to start

      if (nextLine) {
        //whatever state state: single line block retrns itself
        if (nextLine.indent == startLine.indent) {
          //exit
          result = [startLine]
        }

        //error state: trying to get block from a nonheader
        else if (nextLine.indent < startLine.indent) {
          //console.log(startLine)
          throw Error('^^^ <- line is not head: cant get Block!')
        }
        // = is nextline.indent > startline.index
        else {
          let firstBlock = true //TODO: this is such a bad solution but im high and i wanna be done with this
          let indentedBlock = lines.slice(nextLine.index).filter(line => {
            //
            if (firstBlock && line.indent == nextLine.indent) {
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

  function compileError (type, errorLine, causingLine, expectedPattern) {
    const messages = [`Error when compiling on line: ${errorLine}`]
    //types: match, invalidCharacters, redeclarationScene, redeclarationChapter, ,
    switch (type) {
      case 'match':
        messages.push(`Unrecognized pattern for`, `"${causingLine}"`)

        break

      default:
        break
    }

    messages.push('Breaking...')

    throw new Error(messages.join('\n'))
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

function capt (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
