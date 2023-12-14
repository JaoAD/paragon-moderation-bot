// Require the path module
const path = require("path");

// Set the path to the mutedUsers.json file
const mutedUsersPath = path.join(__dirname, "../database/mutedUsers.json");

// Require the mutedUsers.json file
const mutedUsers = require(mutedUsersPath);

// Require the writeFileData function from botFunctions.js
const { writeFileData } = require("./botFunctions");

// Require the EmbedBuilder function from discord.js
const { EmbedBuilder } = require("discord.js");

// Require dotenv
require("dotenv").config();

// Create a function to update the mutedUsers.json file
const updateMuteRecords = async (userToMute, reason, mutedBy) => {
  // If the user is not already in the mutedUsers.json file, add them
  if (!mutedUsers[userToMute.id]) {
    mutedUsers[userToMute.id] = [];
  }

  // Add the mute reason, date, and muter ID to the array of mute records
  mutedUsers[userToMute.id].push({
    reason: reason,
    date: new Date().toISOString(),
    mutedBy: mutedBy,
  });

  // Write the updated mutedUsers.json file
  await writeFileData(mutedUsersPath, mutedUsers);
};

// Create a function to notify the user of their mute
const notifyUserOfMute = async (userToMute, notifyMute) => {
  try {
    await userToMute.send({ embeds: [notifyMute] });
  } catch (dmError) {
    console.error(
      "\t⚠️\tCould not send DM to user, they might have DMs disabled.",
      dmError
    );
  }
};

// Create a function to log the mute in the mute logs channel
const logMuteInChannel = async (client, guild, userToMute, reason, mutedBy) => {
  // Get the mute logs channel ID from the .env file
  const muteLogsChannelId = process.env.MUTE_LOGS;

  // Get the mute logs channel
  const muteLogsChannel = await client.channels.fetch(muteLogsChannelId);

  // If the mute logs channel exists, log the mute
  if (muteLogsChannel) {
    // Create an embed to send to the mute logs channel
    const embed = new EmbedBuilder()
      .setTitle(`${userToMute.tag}`)
      .setURL(`https://discord.gg/tacticool`)
      .setColor("Yellow")
      .setThumbnail(userToMute.displayAvatarURL())
      .addFields(
        { name: "Reason", value: reason },
        { name: "Muted By", value: `<@${mutedBy}>`, inline: true }
      )
      .setFooter({
        text: `${userToMute.id}`,
        iconURL: "https://i.postimg.cc/MTZhQ8db/image.png",
      })
      .setTimestamp();

    // Send the embed to the mute logs channel
    await muteLogsChannel.send({ embeds: [embed] });
  }
};

// Export the functions
module.exports = {
  updateMuteRecords,
  notifyUserOfMute,
  logMuteInChannel,
};
