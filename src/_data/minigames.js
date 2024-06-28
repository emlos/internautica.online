const util = require("../../util/readfiles");
const base = __dirname;

module.exports = {
  stripgame: {
    common: {
      wardrobe: util.readImagePathsFromFolder(
        base,
        "../images/minigames/stripgame/"
      )[1],
      bubble: util.readImagePathsFromFolder(
        base,
        "../images/minigames/stripgame/" //base is relative to this script location
      )[0],
    },
    dismas: {
      base: util.readImagePathsFromFolder(
        base,
        "../images/minigames/stripgame/dismas/"
      )[0],
      standard: util.readImagePathsFromFolder(
        base,
        "../images/minigames/stripgame/dismas/standard"
      ),
      extras: util.readImagePathsFromFolder(
        base,
        "../images/minigames/stripgame/dismas/acc"
      ),
      outfits: {
        prison: util.readImagePathsFromFolder(
          base,
          "../images/minigames/stripgame/dismas/prison"
        ),
        maid: util.readImagePathsFromFolder(
          base,
          "../images/minigames/stripgame/dismas/maid"
        ),
      },
      speech: [
        "Mh, I like *that*.",
        "This one's one of my favorites!",
        "Got that one in a heist, way back.",
        `What makes you think I've got a "favourite"?`,
        `Ey, slow down! Let a guy tease ya fer a bit!`,
        `Love me a soft touch, yeah.`,
        `I'll need a good scrub after that.`,
        `My *favorite* color~`,
        `Heh, that tickles!`,
        `Yer eager, huh?`,
        `Gotta search fer hidden daggers, I feel ya.`,
        `"No gendarme, I ain't got anythin' on me!"`,
        `*seductive whistle*`,
        `Mmm, doin' a good job of it.`,
        `Careful, don't want me to do this to you, do ya?`,
        `Bored? I hope not.`,
        `Aw, c'mere!`,
        `Don't wanna reveal too much... Ah, what the hell!`,
        `Love spurned me once. But, I don't think ya will.`,
        `What'cha doin' with it?`,
        `Apologies for the smell, been ages since I've had a good scrub.`,
        `You like it? Had this one since forever.`,
        `*He* always liked that one.`,
        `Damn I'm sore... Wanna give me a massage while yer at it?`,
        `Ladies *love* 'em a man with scars.`,
        `'s an old hand-me-down... Better keep it off, yeah.`,
        `Mmh, that's relaxin'.`,
        `You sure are takin' yer time with this.`,
        `*snicker*`,
        `I needed that.`,
        `Can't wait for my turn.`,
        `Mhm, you're a good one.`,
        `*growl*`,
        `Feels good. Keep goin'.`,
        `Never cared much fer looks.`,
        `Oh, I think one's still a bit bloody, careful.`,
    paracelsus: {
      base: util.readImagePathsFromFolder(
        base,
        "../images/minigames/stripgame/paracelsus/"
      )[0],
      standard: util.readImagePathsFromFolder(
        base,
        "../images/minigames/stripgame/paracelsus/standard"
      ),

      outfits: {
        backstory: util.readImagePathsFromFolder(
          base,
          "../images/minigames/stripgame/paracelsus/backstory"
        ),
        angel: util.readImagePathsFromFolder(
          base,
          "../images/minigames/stripgame/paracelsus/angel"
        ),
      },

      speech: [
      `Ah! Such strange sensation...`,
      `This method is quite unorthodox.`,
      `Have you no shame? Wear gloves, for light's sake!`,
      `The doctor is *in*, yes.`,
      `*surprised gasp*`,
      `Cold hands! Cold hands!`,
      `All this is sterile - against the miasma.`,
      `This is a fascinating experiment.`,
      `I- suppose if it's for the good of science...`,
      `Right there! There's all the nerves...`,
      `Feeling positively sanguine, heheh...`,
      `You know you have quite a...striking anatomy~`,
      `Oh! Didn't even know that part existed!`,
      `*inquisitive humming*`,
      `D-did the thief slip me something?`,
      `Your hands...such exquisite craftsmanship`,
      `Of course my knives are clean...why do you ask?`,
      `Do I seem attractive to you? I used a new tonic.`,
      `L-lots of things to learn outside of a book.`,
      `...pulse quickens… humours churn… body reacts…`,
      `Ah, my favorite experiment!`,
      `Did you wash your hands?`,
      `...oxytocin and vasopressin... o-oh!`,
      `I hope there's more where that came from...`,
      `This? Keeps away the miasma.`,
      `These juvenile pastimes do lighten the mood so!`,
      `I miss my leeches...`,
      `Mind the vials!`,
      `My *ekhm* instruments require precise edges...`,
      `Hehe, they used to say I had *naked* ambition.`,
      `The Eastern peoples have this one ritual...`,
      `Time to put my learnings to practice.`,
      `Don't be shy, I have tinctures against bites!`,
      `There's some tools in my kit back there.`,
      `Mh... don't stop! Doctors orders.`,
      `I get you 'need' it, but slow down...you'll tear a stitch.`,
      `'Subject reports flushing-' hm? Carry on!`,
      `This was all the rage at the university.`
      ],
    },
  },
  hiding: {
    colors: Object.freeze({
      BLACK: " #000000",
      DARK_GREEN: "#005500",
      NORMAL_GREEN: "#00ab00",
      LIGHT_GREEN: "#00ff00",
      DARK_BLUE: "#0000ff",
      NORMAL_BLUE: "#0055ff",
      LIGHT_BLUE: "#00abff",
      NORMAL_TEAL: "#00ffff",
      NORMAL_RED: "#ff0000",
      DARK_ORANGE: "#ff5500",
      LIGHT_ORANGE: "#ffab00",
      NORMAL_YELLOW: "#ffff00",
      DARK_PINK: "#ff00ff",
      NORMAL_PINK: "#ff55ff",
      LIGHT_PINK: "#ffabff",
      WHITE: " #ffffff",
    }),
    entities: Object.freeze({
      EMPTY: 0,
      WALL: 1,
      GUARD: 2,
      DOG: 3,
      PLAYER: 999,
    }),
  },
};
