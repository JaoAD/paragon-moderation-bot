const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");
const {
  updateBanRecords,
  notifyUserOfBan,
  logBanInChannel,
} = require("../../functions/banSystem");

module.exports = {
  deleted: false,
  name: "ban",
  description: "Permanently ban a user from the server.",
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
      description: "@mention or ID of the user to ban.",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: "reason",
      description: "Reason for banning the user.",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "proof",
      description: "Attach proof (file/image/video).",
      required: true,
      type: ApplicationCommandOptionType.Attachment,
    },
    {
      name: "delete_messages",
      description: "Delete user's previous messages.",
      required: true,
      type: ApplicationCommandOptionType.Boolean,
    },
  ],

  callback: async (client, interaction) => {
    try {
      // Defer the interaction immediately
      await interaction.deferReply({ ephemeral: true });

      const userToBan = interaction.options.getUser("user");
      const reason = interaction.options.getString("reason");
      const proof = interaction.options.getAttachment("proof");
      const deleteMessages = interaction.options.getBoolean("delete_messages");

      // Fetch messages
      const messages = await interaction.channel.messages.fetch({
        limit: 100,
      });

      // Filter user's messages
      const userMessages = messages.filter(
        (msg) => msg.author.id === userToBan.id
      );

      // Delete user's messages if the option is true and messages are found
      if (deleteMessages && userMessages.size > 0) {
        await interaction.channel.bulkDelete(userMessages, true);
      } else if (deleteMessages) {
        // Handle case where no messages are found
        await interaction.followUp({
          content: `No messages found for ${userToBan.tag}.`,
          ephemeral: true,
        });
      }

      // Create the embed for notifying the user
      const notifyBan = new EmbedBuilder()
        .setTitle(`${userToBan.tag}`)
        .setDescription(
          `You have been banned from **${interaction.guild.name}**.`
        )
        .setColor("Red")
        .setThumbnail(interaction.user.displayAvatarURL())
        .setURL(`${proof.url}`)
        .addFields(
          { name: "Reason", value: reason },
          {
            name: "Proof",
            value: `📎 [Click to view](${proof.url})`,
            inline: true,
          },
          {
            name: "Banned by",
            value: `<@${interaction.user.id}>`,
            inline: true,
          }
        )
        .setImage(`${proof.url}`)
        .setFooter({
          text: `${userToBan.id}`,
          iconURL: "https://i.postimg.cc/MTZhQ8db/image.png",
        })
        .setTimestamp();

      // Update the ban records
      await updateBanRecords(userToBan, reason, proof.url, interaction.user.id);

      // Notify the user and log the ban
      await notifyUserOfBan(userToBan, notifyBan);

      // Log the ban in the ban logs channel
      await logBanInChannel(
        client,
        interaction.guild,
        userToBan,
        reason,
        proof.url,
        interaction.user.id
      );

      // Perform the ban operation
      await interaction.guild.members.ban(userToBan.id, { reason });

      // Reply to the interaction
      await interaction.followUp({
        content: `User ${userToBan.tag} has been banned.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(
        "\t⚠️\tAn error occurred while using the command /ban",
        error
      );
      await interaction.followUp({
        content: "An error occurred while processing the ban command.",
        ephemeral: true,
      });
    }
  },
};
