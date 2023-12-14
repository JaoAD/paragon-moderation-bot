const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");
const {
  updateKickRecords,
  notifyUserOfKick,
  logKickInChannel,
} = require("../../functions/kickSystem"); // Update the import to kickSystem

module.exports = {
  deleted: false,
  name: "kick",
  description: "Kick a user from the server.",
  permissionsRequired: [
    PermissionFlagsBits.KickMembers,
    PermissionFlagsBits.ManageMessages,
  ],
  botPermissions: [
    PermissionFlagsBits.KickMembers,
    PermissionFlagsBits.ManageMessages,
  ],

  options: [
    {
      name: "user",
      description: "@mention or ID of the user to kick.",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: "reason",
      description: "Reason for kicking the user.",
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

      const userToKick = interaction.options.getUser("user");
      const reason = interaction.options.getString("reason");
      const proof = interaction.options.getAttachment("proof");
      const deleteMessages = interaction.options.getBoolean("delete_messages");

      // Fetch messages
      const messages = await interaction.channel.messages.fetch({
        limit: 100,
      });

      // Filter user's messages
      const userMessages = messages.filter(
        (msg) => msg.author.id === userToKick.id
      );

      // Delete user's messages if the option is true and messages are found
      if (deleteMessages && userMessages.size > 0) {
        await interaction.channel.bulkDelete(userMessages, true);
      } else if (deleteMessages) {
        // Handle case where no messages are found
        await interaction.followUp({
          content: `No messages found for ${userToKick.tag}.`,
          ephemeral: true,
        });
      }

      // Create the embed for notifying the user
      const notifyKick = new EmbedBuilder()
        .setTitle(`${userToKick.tag}`)
        .setDescription(
          `You have been kicked from **${interaction.guild.name}**.`
        )
        .setColor("Orange") // You can adjust the color as needed
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
            name: "Kicked by",
            value: `<@${interaction.user.id}>`,
            inline: true,
          }
        )
        .setImage(`${proof.url}`)
        .setFooter({
          text: `${userToKick.id}`,
          iconURL: "https://i.postimg.cc/MTZhQ8db/image.png",
        })
        .setTimestamp();

      // Notify the user and log the kick
      await notifyUserOfKick(userToKick, notifyKick);
      await logKickInChannel(
        client,
        interaction.guild,
        userToKick,
        reason,
        proof.url,
        interaction.user.id
      );

      // Perform the kick operation
      await interaction.guild.members.kick(userToKick.id, { reason });

      // Update the kick records
      await updateKickRecords(
        userToKick,
        reason,
        proof.url,
        interaction.user.id
      );

      // Reply to the interaction
      await interaction.followUp({
        content: `User ${userToKick.tag} has been kicked.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(
        "\t⚠️\tAn error occurred while using the command /kick",
        error
      );
      await interaction.followUp({
        content: "An error occurred while processing the kick command.",
        ephemeral: true,
      });
    }
  },
};
