const util = require('../../util/readfiles')
const base = __dirname

module.exports = {
    common: {
        wardrobe: util.readImagePathsFromFolder(base, '../images/minigames/dismas-stripgame/')[1],
    },
    dismas: {
        base: util.readImagePathsFromFolder(base, '../images/minigames/dismas-stripgame/')[0],
        standard: util.readImagePathsFromFolder(base, '../images/minigames/dismas-stripgame/standard'),
        extras : util.readImagePathsFromFolder(base, '../images/minigames/dismas-stripgame/acc')
    }
}