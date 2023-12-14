const Discord = require("discord.js");
const path = require("path");
const kickedUsersPath = path.join(__dirname, "../../database/kickedUsers.json");
const kickedUsers = require(kickedUsersPath);

const { writeFileData } = require("../../functions/botFunctions");

const {
  Client,
  Interaction,
  EmbedBuilder,
  PermissionFlagsBits,
  ApplicationCommandOptionType,
} = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 */

module.exports = {
  deleted: false,
  name: "check_kicks",
  description: "Check user kick history.",
  permissionsRequired: [PermissionFlagsBits.KickMembers],
  botPermissions: [PermissionFlagsBits.KickMembers],

  options: [
    {
      name: "user",
      description: "@mention or ID to check user kick history.",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
  ],

  callback: async (client, interaction) => {
    try {
      const userToCheck = interaction.options.getUser("user");

      // Initialize an array to store the kick history embed fields
      const kickHistoryFields = [];

      // Check if the user has a kick history
      const kickRecords = kickedUsers[userToCheck.id];
      if (kickRecords && kickRecords.length > 0) {
        const timeZone = "Asia/Manila";

        // Loop through the kick records and add each one as a field
        kickRecords.forEach((record, index) => {
          // Convert the stored date to a Date object
          const kickDate = new Date(record.date);
          // Convert the kick date to UTC+8 and format it
          const formattedDate = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: timeZone,
            timeZoneName: "short",
          }).format(kickDate);

          kickHistoryFields.push({
            name: `Kick no. ${index + 1}`,
            value: `Reason: ${record.reason}\nDate: ${formattedDate}\nProof: 📎 [Click to view](${record.proofUrl})\nKicked by: <@${record.kickedBy}>`,
            inline: false,
          });
        });
      } else {
        // If there is no kick history for the user, add a field stating that
        kickHistoryFields.push({
          name: "Kick History",
          value: "This user has no recorded kick history.",
          inline: false,
        });
      }

      // Create the embed with the kick history fields
      const kickHistoryEmbed = new Discord.EmbedBuilder()
        .setColor("Orange")
        .setTitle(`${userToCheck.tag}`)
        .setURL(`https://discord.gg/tacticool`)
        .addFields(kickHistoryFields)
        .setFooter({
          text: `${userToCheck.id}`,
          iconURL: `https://i.postimg.cc/MTZhQ8db/image.png`,
        })
        .setThumbnail(userToCheck.displayAvatarURL())
        .setTimestamp();

      // Reply to the interaction with the kick history embed
      await interaction
        .reply({ embeds: [kickHistoryEmbed], ephemeral: true })
        .catch(console.error);
    } catch (error) {
      console.error(
        "\t⚠️\tAn error occurred while using the command /checkkicks",
        error
      );
    }
  },
};
