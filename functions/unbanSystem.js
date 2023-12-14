const { EmbedBuilder } = require("discord.js");

// logUnbanInChannel - logs the unban in the unban logs channel
// client - the bot client
// userId - the user that was unbanned
// reason - the reason for the unban
// unbannedBy - the moderator that unbanned the user
const logUnbanInChannel = async (client, userId, reason, unbannedBy) => {
  // get the unban logs channel id from the .env file
  const unbanLogsChannelId = process.env.UNBAN_LOGS;
  // get the unban logs channel
  const unbanLogsChannel = await client.channels.fetch(unbanLogsChannelId);

  // if the channel exists, send the unban log embed
  if (unbanLogsChannel) {
    // get the unbanned user
    const user = await client.users.fetch(userId);

    // create the unban log embed
    const embed = new EmbedBuilder()
      .setTitle(`${user.tag}`)
      .setURL(`https://discord.gg/tacticool`)
      .setColor("Green")
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: "Reason", value: reason },
        { name: "Unbanned By", value: `<@${unbannedBy.id}>`, inline: true }
      )
      .setFooter({
        text: `${userId}`,
        iconURL: `https://i.postimg.cc/MTZhQ8db/image.png`,
      })
      .setTimestamp();

    // send the unban log embed
    await unbanLogsChannel.send({ embeds: [embed] });
  }
};

// Log manual unban
const logManualUnban = async (client, guild, user, unbannedBy) => {
  // Get the channel ID from the environment file
  const unbanLogsChannelId = process.env.UNBAN_LOGS;
  // Fetch the channel from the ID
  const unbanLogsChannel = await client.channels.fetch(unbanLogsChannelId);

  // If the channel exists
  if (unbanLogsChannel) {
    // Create a new embed
    const embed = new EmbedBuilder()
      // Set the title to the user's tag and that they were manually unbanned
      .setTitle(`${user.tag} has been manually unbanned`)
      // Set the color to green
      .setColor("Green")
      // Set the thumbnail to the user's avatar URL
      .setThumbnail(user.displayAvatarURL())
      // Add a field for the unbanned by
      .addFields({
        name: "Unbanned By",
        value: `<@${unbannedBy.id}>`,
        inline: true,
      })
      // Set the footer to the user's ID and the avatar URL to the Discord logo
      .setFooter({
        text: `${user.id}`,
        iconURL: `https://i.postimg.cc/MTZhQ8db/image.png`,
      })
      // Set the timestamp to now
      .setTimestamp();

    // Send the embed to the channel
    await unbanLogsChannel.send({ embeds: [embed] });
  }
};

module.exports = {
  logUnbanInChannel,
  logManualUnban,
};
