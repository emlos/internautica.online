const fs = require("fs");
const path = require("path");

// Function to read image paths from a given folder
function readImagePathsFromFolder(folderPath, subfolder) {
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const imagePaths = files
          .filter((file) =>
            ["gif", "png", "jpg", "jpeg", "webm"].includes(file.split(".")[1])
          )
          .map((file) => {
            return {
              source: path.join("/images", subfolder, file),
              alt: file.split(".")[0],
              date: fs.statSync(path.join(folderPath, file)).mtime.getTime(),
            };
          })
          .sort(function (a, b) {
            return a.date - b.date;
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

  const milo = await readImagePathsFromFolder(
    path.join(__dirname, "..", "images", "mine", "milo"),
    path.join("mine", "milo")
  );

  const transformers = await readImagePathsFromFolder(
    path.join(__dirname, "..", "images", "mine", "transformers"),
    path.join("mine", "transformers")
  );

  //console.log(cards);
  return {
    links: [
      {
        url: "cards",
        name: "deadpools villain cards",
        description:
          "So when I was like 18 i absolutely NEEDED to cosplay squirrel girl (nothing came of it, as usual tho), and as a prop i thought how AWESOME it would be if i had my own deadpool bad guy cards he gifts squirrel girl. the project never went anywhere, but heres some of the cards, hand redrawn and retyped, in case you want to do what i did not :]",
      },

      {
        url: "transformers",
        name: "those robots that turn into vehicles",
        description:
          "i got into transformers in late 2019, from, embarrassingly, x readers on tumblr haha. and yet in those short three years, ive been to tfn 2022, amassed an odd ~70 comics, have had dozens of figures, and of course obtained the designated  specialest little guy: starscream (or getaway, depending on your persuasion haha)",
      },
      {
        url: "milo",
        name: "my self portrait gallery",
        description:
          "everyone has a 'sona' or whatever, so this page documents how i draw mine. my skin is green (when my hair isnt) and i always wear a thousand-yard stare and headphones, or grin like an idiot :3 <br> but yeah, i also change hair colors evey few weeks, and my art style is not consistent, so yknow",
      },
    ],

    images: {
      cards: {
        title: "Deadpool Villains Cards!",
        description:
          "feel free to download and print those out, but please don't put them online and claim you upscaled them or whatever, this was a very autistic project for me and is hand redrawn!",
        images: cards,
      },
      selfportraits: {
        title: "the [milo] of it all",
        description: "sometimes i draw myself, because im a real person",
        images: milo,
      },
      transformers: {
        title: "till all are one",
        description:
          "all of my transformers pieces, in one place! also getaway > rodimus and rid > mtmte/ll sorry!",
        images: transformers,
      },
    },
  };
};
