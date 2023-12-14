const Discord = require("discord.js");
const { InteractionResponse } = require("discord.js");
const { devs, testServer } = require("../../config.json");
const getLocalCommands = require("../../utils/getLocalCommands");
require("dotenv").config(); // .env

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const localCommands = getLocalCommands();

  try {
    const commandObject = localCommands.find(
      (cmd) => cmd.name === interaction.commandName
    );

    const authorID = interaction.user.id;
    const author = interaction.user.tag;
    const command = interaction.commandName;

    // Extract the command options and their values
    const options = interaction.options.data.map(
      (option) => `${option.name}: ${option.value}`
    );
    const optionsString = options.join(", ");

    console.log(`${authorID} | ${author} > /${command} ${optionsString}`);

    // Log command usage and options in the specified channel
    const logChannel = client.channels.cache.get(process.env.CONSOLE_LOGS);
    if (logChannel) {
      logChannel.send(
        `${authorID} | <@${authorID}> > **/${command}** \`${optionsString}\``
      );
    }

    if (!commandObject) return;

    if (commandObject.devOnly) {
      if (!devs.includes(interaction.member.id)) {
        interaction.reply({
          content: "Only developers are allowed to run this command.",
          ephemeral: true,
        });
        return;
      }
    }

    if (commandObject.testOnly) {
      if (interaction.guild.id === testServer) {
        interaction.reply({
          content: "This command cannot be ran here.",
          ephemeral: true,
        });
        return;
      }
    }
    // This checks user permissions
    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          const embedNoPerms = new Discord.EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `❌ **You Need Permission to Perform This Command**`
            );

          interaction.reply({
            embeds: [embedNoPerms],
            ephemeral: true,
          });
          return;
        }
      }
    }

    // This checks bot permissions
    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        const bot = interaction.guild.members.me;

        if (!bot.permissions.has(permission)) {
          interaction.reply({
            content: "I don't have enough permissions.",
            ephemeral: true,
          });
          return;
        }
      }
    }
    await commandObject.callback(client, interaction);
  } catch (error) {
    console.log(error);
  }
};
