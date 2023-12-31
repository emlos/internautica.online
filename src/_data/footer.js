const fs = require("fs");
const path = require("path");

// Function to read image paths from a given folder
function readImagePathsFromFolder(folderPath, subfolder) {
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const imagePaths = files.filter(filterImageFiles).map((file) =>
          path.join("/images", subfolder, file)
        );
        resolve(imagePaths);
      }
    });
  });
}

function filterImageFiles(filename) {
  const allowedExtensions = [".jpg", ".png", ".gif"];
  const fileExtension = filename.slice(filename.lastIndexOf(".")).toLowerCase();
  return allowedExtensions.includes(fileExtension);
}



module.exports = async function () {
  const buttonsFolderPath = "buttons";
  const blinkiesFolderPath = "blinkies";


  const buttons = await readImagePathsFromFolder(
    path.join(__dirname, "..", "images", buttonsFolderPath),
    buttonsFolderPath
  );
  const blinkies = await readImagePathsFromFolder(
    path.join(__dirname, "..", "images", blinkiesFolderPath),
    blinkiesFolderPath
  );
  return {
    blinkies: blinkies,
    buttons: buttons,
    links: [
      {
        icon: "",
        name: "this repo",
        url: "https://github.com/emlos/internautica.online",
      },

      {
        icon: "",
        name: "letterboxd",
        url: "https://letterboxd.com/filan12/",
      },
      {
        icon: "",
        name: "reddit",
        url: "https://www.reddit.com/user/filan12",
        nsfw: true,
      },
      {
        icon: "",
        name: "rss feed",
        url: "https://internautica.neocities.org/feed.xml",
      },
      {
        icon: "",
        name: "ko-fi",
        url: "https://ko-fi.com/emlos",
      },

      {
        name: "last.fm",
        url: "https://www.last.fm/user/filan12",
      },
    ],
  };
};
