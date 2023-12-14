const Discord = require("discord.js");
const path = require("path");
const bannedUsersPath = path.join(__dirname, "../../database/bannedUsers.json");
const bannedUsers = require(bannedUsersPath);

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
  name: "check_bans",
  description: "Check user ban history.",
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],

  options: [
    {
      name: "user",
      description: "@mention or ID to check user ban history.",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
  ],

  callback: async (client, interaction) => {
    try {
      const userToCheck = interaction.options.getUser("user");

      // Initialize an array to store the ban history embed fields
      const banHistoryFields = [];

      // Check if the user has a ban history
      const banRecords = bannedUsers[userToCheck.id];
      if (banRecords && banRecords.length > 0) {
        const timeZone = "Asia/Manila";

        // Loop through the ban records and add each one as a field
        banRecords.forEach((record, index) => {
          // Convert the stored date to a Date object
          const banDate = new Date(record.date);
          // Convert the ban date to UTC+8 and format it
          const formattedDate = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: timeZone,
            timeZoneName: "short",
          }).format(banDate);

          banHistoryFields.push({
            name: `Ban no. ${index + 1}`,
            value: `Reason: ${record.reason}\nDate: ${formattedDate}\nProof: 📎 [Click to view](${record.proofUrl})\nBanned by: <@${record.bannedBy}>`,
            inline: false,
          });
        });
      } else {
        // If there is no ban history for the user, add a field stating that
        banHistoryFields.push({
          name: "Ban History",
          value: "This user has no recorded ban history.",
          inline: false,
        });
      }

      // Create the embed with the ban history fields
      const banHistoryEmbed = new Discord.EmbedBuilder()
        .setColor("Red")
        .setTitle(`${userToCheck.tag}`)
        .setURL(`https://discord.gg/tacticool`)
        .addFields(banHistoryFields)
        .setFooter({
          text: `${userToCheck.id}`,
          iconURL: `https://i.postimg.cc/MTZhQ8db/image.png`,
        })
        .setThumbnail(userToCheck.displayAvatarURL())
        .setTimestamp();

      // Reply to the interaction with the ban history embed
      await interaction
        .reply({ embeds: [banHistoryEmbed], ephemeral: true })
        .catch(console.error);
    } catch (error) {
      console.error(
        "\t⚠️\tAn error occurred while using the command /checkbans",
        error
      );
    }
  },
};
