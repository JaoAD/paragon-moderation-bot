const fs = require('fs'); // filesystem
const path = require('path');

module.exports = (directory, foldersOnly = false) => {
    let fileNames = [];

    const files = fs.readdirSync(directory, { withFileTypes: true });

    // Loop through all of the files to check if it is a file/folder
    for (const file of files) {
        const filePath = path.join(directory, file.name);

        // Check if a file is a folder
        if (foldersOnly) {
            // If file is a folder it will be pushed inside fileNames
            if (file.isDirectory()) {
                fileNames.push(filePath);
            }
        }
        // Check if a file is a file
        else {
            // If file is a file it will be pushed inside fileNames
            if (file.isFile()) {
                fileNames.push(filePath);
            }
        }

    }

    return fileNames;
}