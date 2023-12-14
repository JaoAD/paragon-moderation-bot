const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { logUnbanInChannel } = require("../../functions/unbanSystem");

module.exports = {
  deleted: false,
  name: "unban",
  description: "Unban a user from the server.",
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],

  options: [
    {
      name: "user",
      description: "@mention or ID of the user to unban.",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: "reason",
      description: "Reason for unbanning the user.",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],

  callback: async (client, interaction) => {
    try {
      const userId = interaction.options.getUser("user").id;
      const reason = interaction.options.getString("reason");

      // Unban the user
      await interaction.guild.members.unban(userId, { reason });

      // Log the unban in the unban logs channel
      await logUnbanInChannel(client, userId, reason, interaction.user.id);

      // Reply to the interaction
      await interaction.reply({
        content: `User with ID ${userId} has been unbanned.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(
        "\t⚠️\tAn error occurred while using the command /unban",
        error
      );
      await interaction.reply({
        content: "An error occurred while processing the unban command.",
        ephemeral: true,
      });
    }
  },
};
