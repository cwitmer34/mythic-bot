require("dotenv").config();
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");
const config = require("./src/config.json");

const commands = [
  {
    name: "register",
    description: "Start the player registration process",
  },
  {
    name: "reviewapps",
    description: "Start reviewing player registration applications",
  },
  {
    name: "playercount",
    description: "Get the current player count (test command)",
  },
  {
    name: "checkappstatus",
    description: "Check the status of a player registration application",
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
