const fs = require('fs');
const path = require('path');


// Function to read image paths from a given folder
module.exports = {
  readImagePathsFromFolder: function (base, relativePath, allowedExtensions = ['png', 'jpg', 'gif'], absolute = true) {
    try {
        
        // Resolve the relative path to an absolute path
        const absolutePath = path.resolve(base, relativePath);
        // Synchronously read the files in the directory
        const files = fs.readdirSync(absolutePath).filter((file) => {
            return allowedExtensions.includes(file.split('.')[1])
        }).map((file) => {
            return absolute ? path.join(relativePath, file) : file
        }
        );
        // Iterate through the list of files
        return files;
      } catch (err) {
        // Handle errors
        console.error('Error reading directory:', err.message);
      }
      
}
};

