const { client, appsBeingReviewed } = require("../../index");
const mongo = require("../../mongo"); // Ensure this is correct
const mongoose = require("mongoose");
const config = require("../../config.json");
const {
  currentAppEmbed,
  endReviewEmbed,
  noMoreAppsEmbed,
  noAppFoundEmbed,
  appAlreadySubmittedEmbed,
  appWaitingForReviewEmbed,
  denyApplicationEmbed,
  approveApplicationEmbed,
} = require("../../util/embeds/registrationAppReview");
const { ActionRowBuilder, ModalBuilder, TextInputBuilder } = require("@discordjs/builders");
const { ButtonBuilder } = require("@discordjs/builders");
const { ButtonStyle, TextInputStyle } = require("discord.js");
const { alreadyRegistered } = require("../../util/embeds/registrationEmbeds");
const { messageUser } = require("../../util/utils");

client.on("interactionCreate", async (interaction) => {
  if (
    interaction.isCommand() &&
    interaction.commandName === "checkappstatus" &&
    !interaction.user.bot
  )
    checkAppStatus(interaction);
  if (interaction.isCommand() && interaction.commandName === "reviewapps" && !interaction.user.bot)
    startReviewProcess(interaction);

  if (interaction.isButton() && interaction.customId === "approveRegApp" && !interaction.user.bot)
    assignSalary(interaction);

  if (interaction.isModalSubmit() && interaction.customId === "denyModal" && !interaction.user.bot)
    denyApplication(interaction);

  if (interaction.isButton() && interaction.customId === "denyRegApp" && !interaction.user.bot)
    showDenyModal(interaction);

  if (interaction.isButton() && interaction.customId === "skipRegApp" && !interaction.user.bot)
    handleNextApplication(interaction);

  if (interaction.isButton() && interaction.customId === "quitRegApp" && !interaction.user.bot)
    endReviewProcess(interaction);
  if (
    interaction.isModalSubmit() &&
    interaction.customId === "assignSalaryModal" &&
    !interaction.user.bot
  )
    approveApplication(interaction);

  if (
    interaction.isCommand() &&
    interaction.commandName === "playercount" &&
    !interaction.user.bot
  ) {
    const playerCount = await mongo.getPlayerCount();
    interaction.reply({ content: `There are ${playerCount} players registered in the database.` });
  }
});

async function checkAppStatus(interaction) {
  const hasApplied = await mongo.fetchRegistrationApp(interaction.user.id);
  const isRegistered = await mongo.checkPlayerRegistration(interaction.user.id);

  if (isRegistered)
    return interaction.reply({
      embeds: [
        alreadyRegistered(interaction.user.displayName, interaction.user.displayAvatarURL()),
      ],
    });
  if (!hasApplied)
    return interaction.reply({
      embeds: [noAppFoundEmbed(interaction.user.displayName, interaction.user.displayAvatarURL())],
    });

  return interaction.reply({
    embeds: [
      appWaitingForReviewEmbed(interaction.user.displayName, interaction.user.displayAvatarURL()),
    ],
  });
}

async function startReviewProcess(interaction) {
  try {
    const currentApps = await mongo.fetchRegistrationApps();
    if (!currentApps.length)
      return interaction.reply({ embeds: [noMoreAppsEmbed(interaction.user.displayName)] });
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

async function assignSalary(interaction) {
  interaction.showModal(salaryModal(appsBeingReviewed.get(interaction.user.id)[0].username));
}

async function approveApplication(interaction) {
  const salary = interaction.fields.getTextInputValue("assignSalary");
  const player = appsBeingReviewed.get(interaction.user.id)[0];
  player.salary = salary;
  if (player.mainTracker.includes("steam")) {
    player.platform = "steam";
  } else if (player.mainTracker.includes("epic")) {
    player.platform = "epic";
  } else if (player.mainTracker.includes("playstation") || player.mainTracker.includes("ps")) {
    player.platform = "playstation";
  } else if (player.mainTracker.includes("xbox")) {
    player.platform = "xbox";
  } else {
    player.platform = "unknown";
  }
  if (player.denial) delete player.denial;
  if (player.actionReports) delete player.actionReports;
  (player.wins = 0),
    (player.loses = 0),
    (player.wins = 0),
    (player.gamesPlayed = 0),
    (player.goals = 0),
    (player.assists = 0),
    (player.saves = 0),
    (player.shots = 0),
    (player.mvps = 0),
    (player.demos = 0),
    (player.team = "Free Agent"),
    (player.teamId = 0),
    await mongo.savePlayer(appsBeingReviewed.get(interaction.user.id)[0], salary);
  await mongo.deleteRegistrationApp(player._id);
  messageUser(interaction.guild.members.cache.get(player.playerId), approveApplicationEmbed());
  return handleNextApplication(interaction);
}

async function showDenyModal(interaction) {
  const app = appsBeingReviewed.get(interaction.user.id)[0];
  interaction.showModal(denyModal(app.username));
}

async function denyApplication(interaction) {
  const player = appsBeingReviewed.get(interaction.user.id)[0];

  const denyReason = interaction.fields.getTextInputValue("denyAppReason");

  messageUser(
    interaction.guild.members.cache.get(player.playerId),
    denyApplicationEmbed(player, denyReason)
  );
  handleNextApplication(interaction);
}

async function handleNextApplication(interaction) {
  const app = await removeFirstAndGetNext(interaction.user.id);
  if (!app) {
    return interaction.update({
      embeds: [noMoreAppsEmbed(interaction.user.tag)],
      components: [],
    });
  }
  if (interaction.replied)
    interaction.editReply({ embeds: [currentAppEmbed(app)], components: [reviewRow] });
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

const denyModal = (name) =>
  new ModalBuilder()
    .setCustomId("denyModal")
    .setTitle(`Deny ${name}'s Application`)
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("denyAppReason")
          .setLabel("What is the reason for denial?")
          .setPlaceholder("Reason")
          .setStyle(TextInputStyle.Short)
      )
    );

const salaryModal = (name) =>
  new ModalBuilder()
    .setCustomId("assignSalaryModal")
    .setTitle(`Assign ${name}'s Salary`)
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("assignSalary")
          .setLabel("What is this player's salary?")
          .setPlaceholder("Salary")
          .setStyle(TextInputStyle.Short)
      )
    );

async function removeFirstAndGetNext(id) {
  const previousApps = appsBeingReviewed.get(id);
  mongo.deleteRegistrationApp(previousApps[0]._id);
  console.log(previousApps[0]._id);
  if (previousApps.length > 1) {
    previousApps.shift();
    return previousApps[0];
  }
  const docsToExclude = appsBeingReviewed.get(id).map((app) => app._id);
  const newApps = await mongo.fetchRegistrationApps(docsToExclude);
  appsBeingReviewed.set(id, newApps);
  return !!newApps ? newApps[0] : null;
}
