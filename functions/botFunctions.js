// Filesystem, get access to files. Save read
const fs = require("fs"); // filesystem
const utf = "utf-8"; // utf-8 encoding

// Save data to a .json file. Converting the JavaScript value into a JSON String
const writeFileData = (path, data) => {
  fs.writeFileSync(path, JSON.stringify(data));
};

// Read the data from file. Converting the JSON string into a JavaScript value/object
const returnFileData = (path, encoding) => {
  return JSON.parse(fs.readFileSync(path, encoding));
};

module.exports.returnFileData = returnFileData;
module.exports.writeFileData = writeFileData;
