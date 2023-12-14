// Import the path module, which lets us work with paths
const path = require("path");
// Define where the kickedUsers.json file is located
const kickedUsersPath = path.join(__dirname, "../database/kickedUsers.json");
// Import the kickedUsers.json file
const kickedUsers = require(kickedUsersPath);
// Import the writeFileData function, which we will use to write to the kickedUsers.json file
const { writeFileData } = require("./botFunctions");

// Import the EmbedBuilder class, which we will use to make embeds
const { EmbedBuilder } = require("discord.js");
// Import the dotenv module, which will let us access the .env file
require("dotenv").config();

// Update the kick records for a user
const updateKickRecords = async (userToKick, reason, proofUrl, kickedBy) => {
  // If the user hasn't been kicked before, create a blank array
  if (!kickedUsers[userToKick.id]) {
    kickedUsers[userToKick.id] = [];
  }

  // Add the kick record to the array
  kickedUsers[userToKick.id].push({
    reason: reason,
    proofUrl: proofUrl,
    date: new Date().toISOString(),
    kickedBy: kickedBy,
  });

  // Save the kicked users array to the database
  await writeFileData(kickedUsersPath, kickedUsers);
};

// This function sends a message to the user who has been kicked. It
// takes two arguments: the user who has been kicked (userToKick) and
// the embed that will be sent to them (notifyKick).
const notifyUserOfKick = async (userToKick, notifyKick) => {
  // Try to send the embed to the user.
  try {
    await userToKick.send({ embeds: [notifyKick] });
    // If there is an error, print it to the console.
  } catch (dmError) {
    console.error(
      "\t⚠️\tCould not send DM to user, they might have DMs disabled.",
      dmError
    );
  }
};

const logKickInChannel = async (
  client,
  guild,
  userToKick,
  reason,
  proofUrl,
  kickerId
) => {
  // Fetch the channel to send the logs to
  const kickLogsChannelId = process.env.KICK_LOGS;
  const kickLogsChannel = await client.channels.fetch(kickLogsChannelId);

  // Create the embed
  if (kickLogsChannel) {
    const embed = new EmbedBuilder()
      // Set the title
      .setTitle(`${userToKick.tag}`)
      // Set the URL to the server invite
      .setURL(`https://discord.gg/tacticool`)
      // Set the color of the embed
      .setColor("Orange") // You can adjust the color as needed
      // Set the thumbnail to the kicked user's avatar
      .setThumbnail(userToKick.displayAvatarURL())
      // Add the fields
      .addFields(
        { name: "Reason", value: reason },
        { name: "Proof", value: `📎 [Click to view](${proofUrl})` },
        { name: "Kicked By", value: `<@${kickerId}>`, inline: true }
      )
      // Set the image to the proof URL
      .setImage(`${proofUrl}`)
      // Set the footer to the kicked user's ID
      .setFooter({
        text: `${userToKick.id}`,
        iconURL: "https://i.postimg.cc/MTZhQ8db/image.png",
      })
      // Set the timestamp to now
      .setTimestamp();

    // Send the embed
    await kickLogsChannel.send({ embeds: [embed] });
  }
};

module.exports = {
  updateKickRecords,
  notifyUserOfKick,
  logKickInChannel,
};
