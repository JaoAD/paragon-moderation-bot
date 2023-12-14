const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");
const {
  updateMuteRecords,
  notifyUserOfMute,
  logMuteInChannel,
} = require("../../functions/muteSystem");

// Load the MUTE_ROLE from .env
require("dotenv").config();
const { MUTE_ROLE } = process.env;

module.exports = {
  deleted: false,
  name: "mute",
  description: "Mute a user from the server.",
  permissionsRequired: [
    PermissionFlagsBits.BanMembers,
    PermissionFlagsBits.ManageMessages,
  ],
  botPermissions: [
    PermissionFlagsBits.BanMembers,
    PermissionFlagsBits.ManageMessages,
  ],

  options: [
    {
      name: "user",
      description: "@mention or ID of the user to mute.",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: "reason",
      description: "Reason for muting the user.",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "proof",
      description: "Attach proof (file/image/video).",
      required: true,
      type: ApplicationCommandOptionType.Attachment,
    },
  ],

  callback: async (client, interaction) => {
    try {
      const userToMute = interaction.options.getUser("user");
      const reason = interaction.options.getString("reason");
      const proof = interaction.options.getAttachment("proof");

      // Assign the mute role to the user
      await userToMute.roles.add(MUTE_ROLE);

      // Update the mute records
      await updateMuteRecords(userToMute, reason, interaction.user.id);

      // Notify the user of their mute
      await notifyUserOfMute(userToMute, notifyMute);

      // Log the mute in the mute logs channel
      await logMuteInChannel(
        client,
        interaction.guild,
        userToMute,
        reason,
        interaction.user.id
      );

      // Respond to the interaction
      await interaction.reply({
        content: `Successfully muted ${userToMute.tag}.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error("An error occurred while muting a user:", error);
      await interaction.reply({
        content: "Failed to mute the user.",
        ephemeral: true,
      });
    }
  },
};
