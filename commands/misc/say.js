const Discord = require("discord.js");

const {
  writeFileData,
  returnFileData,
} = require("../../functions/botFunctions");

const { Client, Interaction } = require("discord.js");

const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 */

module.exports = {
  deleted: false,
  name: "say",
  description: "Say something by using the Tacticool Bot.",
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.Administrator],

  options: [
    {
      name: "message",
      description: "Your message goes here.",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "file",
      description: "Send a file/image/video here.",
      required: false,
      type: ApplicationCommandOptionType.Attachment,
    },
  ],

  callback: async (client, interaction) => {
    try {
      // Get the message content from the user's input
      const message = interaction.options.getString("message");

      // Get the file from the user's input
      const file = interaction.options.getAttachment("file");

      // Get the text channel where the interaction occurred
      const channel = interaction.channel;

      // Check if a file was provided
      if (file) {
        // Send the message and file to the channel
        await channel.send({ content: message, files: [file] });
      } else {
        // Send only the message to the channel
        await channel.send(message);
      }

      const messageSent = new Discord.EmbedBuilder()
        .setColor("Blue")
        .setDescription("✅ Message sent");

      // Reply to the user indicating the message was sent successfully (ephemeral)
      await interaction.reply({
        embeds: [messageSent],
        ephemeral: true,
      });
    } catch (error) {
      console.error(
        "\t⚠️\tAn error occurred while using the command /text",
        error
      );
    }
  },
};
