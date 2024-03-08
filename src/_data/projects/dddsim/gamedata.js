//hardcoded (maybe read in from conf file?)

const imagesrc = "/images/projects/dddsim/";
const characterssrc = "/images/projects/dddsim/characters/";
module.exports = {
  PlayerState: {
    name: "[NAME PLACEHOLDER]",
    reputation: {
      //the idea here is that the characters are attracted to one of those character flaws, but dont see it as a flaw
      recklessnes: 0, //think first or act first?
      inquisitivity: 0, //be curious, know things
      piety: 0, //how much like a virgin you are [religiously]
      honesty: 0, //lie (and dont get caught).. or do
    },

    flags: []
      //load all possible flags from script and save them as flag_name: "did-something-flag,
  },

  //generate lists from files
  Characters: {
    Player: {
      name: "Player", //NEVER Show this
      sprites: null,
    },
    Narrator: {
      name: "Narrator",
      sprites: null,
    },

    Dismas: {
      name: "Dismas",
      sprites: {
        neutral: characterssrc + "dismas/neutral.png",
        happy: characterssrc + "dismas/happy.png",
        angry: characterssrc + "dismas/angry.png",
      },
    },
    Reynauld: {
      name: "Reynauld",
      sprites: {
        neutral: characterssrc + "reynauld/neutral.png",
        happy: characterssrc + "reynauld/happy.png",
        angry: characterssrc + "reynauld/angry.png",
      },
    },
  },

  Bgs: {
    Placeholder:imagesrc + "backgrounds/" + "intro-carriage.png",
    Forest: imagesrc + "backgrounds/" + "intro-carriage.jpg",
    IntroCarriage: imagesrc + "backgrounds/" + "intro-carriage.jpg",
    HamletViewDay: imagesrc + "backgrounds/" + "intro-carriage.png",
    HamletViewNight: imagesrc + "backgrounds/" + "intro-carriage.png",
  },
};

//geenrate from script files
