const path = require("path");
const getAllFiles = require("../utils/getAllFiles");

module.exports = (client) => {
  const eventFolders = getAllFiles(path.join(__dirname, "..", "events"), true);

  for (const eventFolder of eventFolders) {
    const eventFiles = getAllFiles(eventFolder);
    eventFiles.sort((a, b) => a > b);
    const eventName = eventFolder.replace(/\\/g, "/").split("/").pop();

    client.on(eventName, async (arg) => {
      for (const eventFile of eventFiles) {
        try {
          const eventFunction = require(eventFile);
          await eventFunction(client, arg);
        } catch (err) {
          console.error("Error in event handler:", err.message);
          if (err.code) {
            if (err.code === 10003) {
              console.error(
                "Unknown Channel Error: Check the channel ID and bot permissions."
              );
            } else if (err.code === 10062) {
              console.log(
                "Attempted to respond to an unknown interaction. Ignoring error."
              );
            } else if (err.code === 10008) {
              console.log("Uknown Message. Ignoring error.");
            } else {
              console.error("Unexpected error:", err);
            }
          } else {
            console.error("Unexpected error:", err);
          }
        }
      }
    });
  }
};
