const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { client } = require("../../index");
const { mongo } = require("../../mongo");
const config = require("../../config.json");

const appsBeingReviewed = new Map();

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand() && interaction.commandName === "reviewapps" && !interaction.user.bot)
    startReviewProcess(interaction);

  if (interaction.isButton() && interaction.customId === "approveRegApp" && !interaction.user.bot)
    approveApplication(interaction);

  if (interaction.isButton() && interaction.customId === "denyRegApp" && !interaction.user.bot)
    denyApplication(interaction);

  if (interaction.isButton() && interaction.customId === "skipRegApp" && !interaction.user.bot)
    handleNextApplication(interaction);

  if (interaction.isButton() && interaction.customId === "quitRegApp" && !interaction.user.bot)
    interaction.message.delete();
});

async function startReviewProcess(interaction) {
  const currentApps = await mongo.fetchRegistrationApps();
  appsBeingReviewed.set(interaction.user.id, currentApps);
  console.log("Apps being reviewed:");
  appsBeingReviewed.forEach((value, key) => {
    console.log(`User ID: ${key}, App ID: ${value}`);
  });
}

async function endReviewProcess(interaction) {
  appsBeingReviewed.delete(interaction.user.id);
}

async function approveApplication(interaction) {
  //   await mongo.deleteRegistrationApp(appsBeingReviewed.get(interaction.user.id));
}

async function denyApplication(interaction) {}

async function handleNextApplication(interaction) {}
