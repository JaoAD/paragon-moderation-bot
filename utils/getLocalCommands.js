const path = require('path');
const getAllFiles = require('./getAllFiles');

// This is going to get all the commands locally
// exceptions will exclude specific commands of our choice
module.exports = (exceptions = []) => {
    let localCommands = [];

    // Checking commands folder categories
    const commandCategories = getAllFiles(
        path.join(__dirname, '..', 'commands'),
        true // Set to true because we are only trying to get folders
    )
    
    // Loop through all the files that we got from the folder commands
    for (const commandCategory of commandCategories) {
        const commandFiles = getAllFiles(commandCategory);

        for (const commandFile of commandFiles) {
            const commandObject = require(commandFile);

            if (exceptions.includes(commandObject.name)) {
                continue;
            }
            // Log all the commands to console
            // console.log(commandObject);
            localCommands.push(commandObject);
        }
    }

    return localCommands;
}