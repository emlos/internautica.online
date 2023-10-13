const fs = require("fs");
const path = require("path");

// Function to read image paths from a given folder
function readImagePathsFromFolder(folderPath, subfolder) {
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const imagePaths = files.map((file) => {
          return {
            source: path.join("/images", subfolder, file),
            alt: file.split(".")[0],
          };
        });
        resolve(imagePaths);
      }
    });
  });
}

module.exports = async function () {
  const cards = await readImagePathsFromFolder(
    path.join(__dirname, "..", "images", "mine", "cards"),
    path.join("mine", "cards")
  );

  //console.log(cards);
  return {
    links: [
      {
        url: "/mine/cards",
        name: "deadpools villain cards",
        description:
          "So when I was like 18 i absolutely NEEDED to cosplay squirrel girl (nothing came of it, as usual tho), and as a prop i thought how AWESOME it would be if i had my own deadpool bad guy cards he gifts squirrel girl. the project never went anywhere, but heres some of the cards, hand redrawn and retyped, in case you want to do what i did not :]",
      },
    ],

    images: {
      cards: {
        title: "Deadpool Villains Cards!",
        description: "description goes here",
        images: cards,
      },
      selfportraits:
      {
        title: "the [milo]",
        description: "description goes here",
        images: [],
      }
    },
  };
};
