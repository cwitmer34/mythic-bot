const { client, appsBeingReviewed } = require("../../index");
const mongo = require("../../mongo"); // Ensure this is correct
const mongoose = require("mongoose");
const config = require("../../config.json");
const { currentAppEmbed } = require("../../util/embeds/registrationAppReview");

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
  try {
    const currentApps = await mongo.fetchRegistrationApps();
    console.log(currentApps.length);
    appsBeingReviewed.set(interaction.user.id, currentApps);
    interaction.reply({
      embeds: [currentAppEmbed(currentApps[0])],
    });
  } catch (error) {
    console.error("Error fetching registration apps:", error);
  }
}

async function endReviewProcess(interaction) {
  appsBeingReviewed.delete(interaction.user.id);
}

async function approveApplication(interaction) {
  //   await mongo.deleteRegistrationApp(appsBeingReviewed.get(interaction.user.id));
}

async function denyApplication(interaction) {}

async function handleNextApplication(interaction) {}
