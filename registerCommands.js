require("dotenv").config();
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");
const config = require("./src/config.json");

const commands = [
  {
    name: "register",
    description: "Start the player registration process",
  },
];

const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), {
      body: commands,
    });
    console.log("Successfully registered application (/) commands.");
  } catch (error) {
    console.log(`Error: ${error}`);
  }
})();
