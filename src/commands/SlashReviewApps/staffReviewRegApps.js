const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { client } = require("../../index");
const { mongo } = require("../../mongo");
const { config } = require("../../config.json");

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand() && interaction.commandName === "reviewapps" && !interaction.user.bot)
    startReviewProcess();

  if (interaction.isButton() && interaction.customId === "approveRegApp" && !interaction.user.bot) {
  }
});

function startReviewProcess() {}
