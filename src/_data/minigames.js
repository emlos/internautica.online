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
        `Aw, yer all flushed...`,
        `Want a joke? What's red n' stiff n' burnin'? A candle.`
      ],
    },
    audrey: {
      base: util.readImagePathsFromFolder(
        base,
        "../images/minigames/stripgame/audrey/"
      )[0],
      standard: util.readImagePathsFromFolder(
        base,
        "../images/minigames/stripgame/audrey/standard"
      ),

      outfits: {
        backstory: util.readImagePathsFromFolder(
          base,
          "../images/minigames/stripgame/audrey/backstory"
        ),
        wine: util.readImagePathsFromFolder(
          base,
          "../images/minigames/stripgame/audrey/wine"
        ),
        devil: util.readImagePathsFromFolder(
          base,
          "../images/minigames/stripgame/audrey/devil"
        ),
      },

      speech: [
        `Oh, sweet-thing...`,
        `Careful, I bite.`,
        `So uncouth! Please do keep going.`,
        `Mine are the softest fabrics... and the deadliest blades!`,
        `Why, it's my best coat, of course!`,
        `I deserve the best, that's why you're here.`,
        `*Sinister giggle*`,
        `Aw, I'm charmed~`,
        `That's one welcome distraction, I'd say.`,
        `A lady doesn't kiss and tell! ... Well, maybe this once...`,
        `Share a bit of wine with me? It's a vintage.`,
        `I think you're enjoying this a touch too much.`,
        `Such deft hands... Wonder what other touch they can muster...`,
        `Careful, darling! This is expensive!`,
        `Aw, you wan't to see more of me? Consider me flattered.`,
        `Quite the brute are you?`,
        `Mh, how scandalous... No, don't stop.`,
        `I don't usually hand out the *goods* so easily...`,
        `Oh you're a gem~`,
        `What's in the flask? Come closer and I'll show you.`,
        `I'm in the mood for a bath. Fetch me the salts and wine later?`,
        `*soft sigh*`,
        `Mind the hair, sweet-thing!`,
        `Pampered like that... no less than what I deserve.`,
        `Oh my undergarmets slipped my mind...`, //NOTE: yeah i forgot to draw them but tbh its in character. she got a bra whatever
        `Must you salivate so? Close your mouth, darling.`,
        `*gasp* That is positively filthy!`,
        `Dance with me?`,
        `*wink*`,
        `Fine, I'll admit it. I'm quite enjoying this.`,
        `My foreplay usually involves more knives... But this'll suffice.`,
        `Aw dearie, you're spoiling me! More.`,
        `Come closer... mh, no, *crawl*.`,
        `Imagine I'm a corpse, darling. Pilfer the valuables!`,
        `My usual bedfellows are a tad more... rough.`,
        `The doctor? Why, darling, two of us at once? Naughty...`,
        `Why, you render me positively queenly. I approve.`,
        `My, I feel positively *debauched*!`,
        `Tsk, no slowing down! Focus on the prize, sweet thing.`,
        `Look at you, all flushed. Am I affecting you? *wink*`,
        `Breezy out today, isn't it?`,
        `Hm? This? The finest in town.`,
        
      ],
    },
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
};
