// This code is used to get the bot's ping.
// It is used in the main file as well as in the command handler.
// The function name is "ping".

// Require the Discord.js module
const Discord = require("discord.js");

// Require the PermissionFlagsBits module
const { PermissionFlagsBits } = require("discord.js");

// Create a module export
module.exports = {
  // Set the command as not deleted
  deleted: false,

  // Set the command name
  name: "ping",

  // Set the command description
  description: "Check if the bot is online",

  // Set the permissions required to use the command
  permissionsRequired: [PermissionFlagsBits.SendMessages],

  // Set the permissions required by the bot to use the command
  botPermissions: [PermissionFlagsBits.Administrator],

  // Create a callback function
  callback: async (client, interaction) => {
    // Create an embed
    const embedPing = new Discord.EmbedBuilder()
      // Set the embed color to green
      .setColor("Green")
      // Set the embed description to the user's ping
      .setDescription(`👋 Hello there! \`${client.ws.ping}\`ms`)
      // Set the embed image to the user's avatar
      .setImage(interaction.user.displayAvatarURL());

    try {
      // Reply to the user with the embed
      await interaction.reply({
        embeds: [embedPing],
        ephemeral: true,
      });
    } catch (error) {
      // Log any errors
      console.log(error);
    }
  },
};
