const { client, appsBeingReviewed } = require("../../index");
const mongo = require("../../mongo"); // Ensure this is correct
const mongoose = require("mongoose");
const config = require("../../config.json");
const {
  currentAppEmbed,
  endReviewEmbed,
  noMoreAppsEmbed,
} = require("../../util/embeds/registrationAppReview");
const { ActionRowBuilder } = require("@discordjs/builders");
const { ButtonBuilder } = require("@discordjs/builders");
const { ButtonStyle } = require("discord.js");

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
    endReviewProcess(interaction);
});

async function startReviewProcess(interaction) {
  try {
    const currentApps = await mongo.fetchRegistrationApps();
    console.log(currentApps.length);
    appsBeingReviewed.set(interaction.user.id, currentApps);
    interaction.reply({
      embeds: [currentAppEmbed(currentApps[0])],
      components: [reviewRow],
    });
  } catch (error) {
    console.error("Error fetching registration apps:", error);
  }
}

async function endReviewProcess(interaction) {
  interaction.update({
    embeds: [endReviewEmbed(interaction.user.tag)],
    components: [],
  });
}

async function approveApplication(interaction) {
  //   await mongo.deleteRegistrationApp(appsBeingReviewed.get(interaction.user.id));
}

async function denyApplication(interaction) {}

async function handleNextApplication(interaction) {
  const app = await removeFirstAndGetNext(interaction.user.id);
  if (!app) {
    return interaction.update({
      embeds: [noMoreAppsEmbed(interaction.user.tag)],
      components: [],
    });
  }
  interaction.update({ embeds: [currentAppEmbed(app)], components: [reviewRow] });
}

const reviewRow = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId("approveRegApp")
      .setLabel("Approve")
      .setStyle(ButtonStyle.Success)
  )
  .addComponents(
    new ButtonBuilder().setCustomId("denyRegApp").setLabel("Deny").setStyle(ButtonStyle.Danger)
  )
  .addComponents(
    new ButtonBuilder().setCustomId("skipRegApp").setLabel("Skip").setStyle(ButtonStyle.Primary)
  )
  .addComponents(
    new ButtonBuilder().setCustomId("quitRegApp").setLabel("Quit").setStyle(ButtonStyle.Secondary)
  );

async function removeFirstAndGetNext(id) {
  const previousApps = appsBeingReviewed.get(id);
  if (previousApps.length > 1) {
    previousApps.shift();
    return previousApps[0];
  } else {
    const docsToExclude = previousApps.map((app) => app._id);
    const newApps = await mongo.fetchRegistrationApps(docsToExclude);
    appsBeingReviewed.set(id, newApps);
    return !!newApps ? newApps[0] : null;
  }
}
