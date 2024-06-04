//hardcoded (maybe read in from conf file?)
const fs = require('fs')

const imagesrc = '/images/projects/dddsim/'
const characterssrc = '/images/projects/dddsim/characters/'

module.exports = {
  playerstate: {
    name: null,
    /*
    reputation: {
      //the idea here is that the characters are attracted to one of those character flaws, but dont see it as a flaw
      recklessnes: 0, //think first or act first?
      inquisitivity: 0, //be curious, know things
      piety: 0, //how much like a virgin you are [religiously]
      honesty: 0 //lie (and dont get caught).. or do
    },
*/
    flags: [],
    //load all possible flags from scr  ipt and save them as flag_name: "did-something-flag,?? fr you dont wanna do this bro?
    settings: {
      textspeed: { type: 'counter', value: 90, max: 100, min: 100, step: 5, disabled: false },
      colorblind: {type: 'checkbox',  value: false, disabled: true },
      animation: { type: 'checkbox', value: true, disabled: false },
      debug: { type: 'checkbox', value: true, disabled: false },
      autoplay: { type: 'checkbox', value: false, disabled: true },
      volume: {type: 'counter',  value: 100, max: 100, min: 100, disabled: false },
      language: {
        type: 'values',
        value: 'English',
        values: ['English', 'Polish'],
        disabled: true
      }
    }
  },

  //generate lists from files
  characters: {
    Dismas: {
      name: 'Dismas',
      sprites: {
        angry: '/images/projects/dddsim/characters/dismas/angry.png',
        neutral: '/images/projects/dddsim/characters/dismas/neutral.png',
        happy: '/images/projects/dddsim/characters/dismas/happy.png',
        default: '/images/projects/dddsim/characters/dismas/neutral.png'
      }
    },
    Reynauld: {
      name: 'Reynauld',
      sprites: {
        angry: '/images/projects/dddsim/characters/reynauld/angry.png',
        neutral: '/images/projects/dddsim/characters/reynauld/neutral.png',
        happy: '/images/projects/dddsim/characters/reynauld/happy.png',
        default: '/images/projects/dddsim/characters/reynauld/neutral.png'
      }
    },
    Milo: {
      name: 'Milo',
      sprites: {
        normal: '/images/projects/dddsim/characters/milo/normal.png',
        default: '/images/projects/dddsim/characters/milo/normal.png'
      }
    },
    Player: { name: 'placeholder', sprites: null },
    Narrator: { name: 'Narrator', sprites: null }
  },

  //to be generated

  backgrounds: {
    introcarriage: imagesrc + 'backgrounds/' + 'introcarriage.png',
    placeholder: imagesrc + 'backgrounds/' + 'placeholder.png',
    ruins: imagesrc + 'backgrounds/' + 'ruins.jpg'
  }
}

//geenrate from script files
