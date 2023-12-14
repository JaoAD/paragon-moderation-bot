// Import the needed classes to work with the Discord API.
const { Client, Events, AuditLogEvent } = require("discord.js");

// Import the needed classes to work with the Discord API.
const Discord = require("discord.js");

// Import the needed classes to work with the Discord API.
const eventHandler = require("./handlers/eventHandler");

// Import the dotenv configuration.
require("dotenv").config();

// ##########################################################
// ##########################################################

// Create a new Discord client instance.
const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.DirectMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildPresences,
  ],
  partials: [
    Discord.Partials.Message,
    Discord.Partials.Channel,
    Discord.Partials.GuildMember,
    Discord.Partials.User,
    Discord.Partials.GuildScheduledEvent,
  ],
});

// ##########################################################
// ##########################################################

// Listen for the ready event, which indicates the client has become ready to start working.
client.on("ready", async () => {
  // Fetch the guild the client is in.
  const guild = client.guilds.cache.get(process.env.GUILD_ID);

  // Ensure the guild was found.
  if (!guild) {
    console.error("Guild not found.");
    return;
  }

  // Set the client's presence to the guild name.
  client.user.setPresence({
    activities: [
      {
        name: `${guild.name}`,
        type: Discord.ActivityType.Watching,
      },
    ],
    status: "dnd",
  });

  // Log a message indicating that the client has logged in.
  console.log(`Logged in as ${client.user.tag}!`);
});

// ##########################################################
// ##########################################################

// Handle events.
eventHandler(client);

// Log the client in using the token from the .env file.
client.login(process.env.TOKEN);
