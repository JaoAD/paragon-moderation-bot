// Require the path module
const path = require("path");

// Set the path to the bannedUsers.json file
const bannedUsersPath = path.join(__dirname, "../database/bannedUsers.json");

// Require the bannedUsers.json file
const bannedUsers = require(bannedUsersPath);

// Require the writeFileData function from botFunctions.js
const { writeFileData } = require("./botFunctions");

// Require the EmbedBuilder function from discord.js
const { EmbedBuilder } = require("discord.js");

// Require dotenv
require("dotenv").config();

// Create a function to update the bannedUsers.json file
const updateBanRecords = async (userToBan, reason, proofUrl, bannedBy) => {
  // If the user is not already in the bannedUsers.json file, add them
  if (!bannedUsers[userToBan.id]) {
    bannedUsers[userToBan.id] = [];
  }

  // Add the ban reason, proof URL, date, and banner ID to the array of ban records
  bannedUsers[userToBan.id].push({
    reason: reason,
    proofUrl: proofUrl,
    date: new Date().toISOString(),
    bannedBy: bannedBy,
  });

  // Write the updated bannedUsers.json file
  await writeFileData(bannedUsersPath, bannedUsers);
};

// Create a function to notify the user of their ban
const notifyUserOfBan = async (userToBan, notifyBan) => {
  try {
    await userToBan.send({ embeds: [notifyBan] });
  } catch (dmError) {
    console.error(
      "\t⚠️\tCould not send DM to user, they might have DMs disabled.",
      dmError
    );
  }
};

// Create a function to log the ban in the ban logs channel
const logBanInChannel = async (
  client,
  guild,
  userToBan,
  reason,
  proofUrl,
  bannerId
) => {
  // Get the ban logs channel ID from the .env file
  const banLogsChannelId = process.env.BAN_LOGS;

  // Get the ban logs channel
  const banLogsChannel = await client.channels.fetch(banLogsChannelId);

  // If the ban logs channel exists, log the ban
  if (banLogsChannel) {
    // Create an embed to send to the ban logs channel
    const embed = new EmbedBuilder()
      .setTitle(`${userToBan.tag}`)
      .setURL(`https://discord.gg/tacticool`)
      .setColor("Red")
      .setThumbnail(userToBan.displayAvatarURL())
      .addFields(
        { name: "Reason", value: reason },
        { name: "Proof", value: `📎 [Click to view](${proofUrl})` },
        { name: "Banned By", value: `<@${bannerId}>`, inline: true }
      )
      .setImage(`${proofUrl}`)
      .setFooter({
        text: `${userToBan.id}`,
        iconURL: "https://i.postimg.cc/MTZhQ8db/image.png",
      })
      .setTimestamp();

    // Send the embed to the ban logs channel
    await banLogsChannel.send({ embeds: [embed] });
  }
};

// Export the functions
module.exports = {
  updateBanRecords,
  notifyUserOfBan,
  logBanInChannel,
};
