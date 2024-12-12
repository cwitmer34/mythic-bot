require("dotenv").config();
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");
const config = require("./src/config.json");

const commands = [
  {
    name: "createschedule",
    description: "Create a new schedule",
  },
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
  {
    name: "createteam",
    description: "Create a new team under a franchise",
    options: [
      {
        name: "franchise",
        type: ApplicationCommandOptionType.String,
        description: "The franchise to create the team under",
        required: true,
      },
      {
        name: "teamname",
        type: ApplicationCommandOptionType.String,
        description: "The name of the team",
        required: true,
      },
      {
        name: "tier",
        type: ApplicationCommandOptionType.String,
        description: "The tier of the team",
        required: true,
      },
    ],
  },
  {
    name: "deleteteam",
    description: "Delete a team",
    options: [
      {
        name: "team",
        type: ApplicationCommandOptionType.String,
        description: "The team to delete",
        required: true,
      },
    ],
  },
  {
    name: "createfranchise",
    description: "Create a new franchise",
    options: [
      {
        name: "name",
        type: ApplicationCommandOptionType.String,
        description: "The name of the franchise",
        required: true,
      },
    ],
  },
  {
    name: "deletefranchise",
    description: "Delete a franchise",
    options: [
      {
        name: "franchise",
        type: ApplicationCommandOptionType.String,
        description: "The franchise to delete",
        required: true,
      },
    ],
  },
  {
    name: "setgm",
    description: "Set a user as the GM of a team",
    options: [
      {
        name: "franchise",
        type: ApplicationCommandOptionType.String,
        description: "The franchise to set the GM for",
        required: true,
      },
      {
        name: "user",
        type: ApplicationCommandOptionType.User,
        description: "The user to set as GM",
        required: true,
      },
    ],
  },
  {
    name: "setagm",
    description: "Set a user as the AGM of a team",
    options: [
      {
        name: "franchise",
        type: ApplicationCommandOptionType.String,
        description: "The franchise to set the AGM for",
        required: true,
      },
      {
        name: "user",
        type: ApplicationCommandOptionType.User,
        description: "The user to set as AGM",
        required: true,
      },
    ],
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
