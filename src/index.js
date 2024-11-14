const { Client, IntentsBitField } = require("discord.js");
const mongo = require("./mongo");
const config = require("./config.json");
require("dotenv").config();

const appsBeingReviewed = new Map();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.setMaxListeners(0);

client.on("ready", (c) => {
  console.log(`${c.user.displayName} is now online!`);
});

client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;
  console.log(msg.content);
});
console.log(config.token);
client.login(config.token);

module.exports = { client, appsBeingReviewed };

require("./commands/SlashRegister/playerRegister");
require("./commands/SlashReviewApps/staffReviewRegApps");
