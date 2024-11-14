const mongoose = require("mongoose");
const { Client, IntentsBitField } = require("discord.js");
const config = require("./config.json");
require("dotenv").config();

(async () => {
  await mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  if (mongoose.connect) {
    console.log("Connected to MongoDB");
  } else {
    console.log(`Failed to connect to MongoDB, ready state is ${mongoose.connection.readyState}`);
  }
})();

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

module.exports = { client };

require("./commands/SlashRegister/playerRegister");
