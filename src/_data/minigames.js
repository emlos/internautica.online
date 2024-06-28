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
        "../images/minigames/stripgame/"
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
      ],
    },
  },
};
