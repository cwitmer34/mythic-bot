const { default: axios } = require("axios");
const { client } = require("../../../index");
const { playersCurrentlyRegistering } = require("../playerRegister");
const { validifyTrackers } = require("../../../util/trackersUtil");
const {
  invalidMainTrackerLink,
  mainTrackerLink: mainTrackerLinkSubmit,
  allOtherTrackersSubmit,
  nameInMythic,
} = require("../../../util/embeds/registrationEmbeds");
const { ActionRowBuilder, ButtonStyle, TextInputStyle } = require("discord.js");
const { ButtonBuilder } = require("discord.js");
const { ModalBuilder } = require("discord.js");
const { TextInputBuilder } = require("discord.js");

client.on("interactionCreate", async (interaction) => {
  if (
    !interaction.isModalSubmit() ||
    interaction.user.bot ||
    interaction.customId !== "mainTrackerModal"
  )
    return;

  await interaction.deferUpdate();
  const trackerLink = interaction.fields.getTextInputValue("mainTrackerLink");
  console.log(trackerLink);
  const trackers = await validifyTrackers([trackerLink]);

  if (trackers.invalid.length) {
    return interaction.editReply({
      embeds: [
        invalidMainTrackerLink(interaction.user.displayName, interaction.user.displayAvatarURL()),
      ],
      components: [resubmitRow],
    });
  } else {
    playersCurrentlyRegistering.get(interaction.user.id).mainTracker = trackerLink;
    return await interaction.editReply({
      embeds: [
        allOtherTrackersSubmit(interaction.user.displayName, interaction.user.displayAvatarURL()),
      ],
      components: [otherTrackersRow],
    });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (
    (!interaction.isButton() || interaction.user.bot) &&
    (interaction.customId !== "resubmitMainTracker" ||
      interaction.customId !== "resubmitOtherTrackers")
  )
    return;

  if (interaction.customId === "resubmitMainTracker") {
    await interaction.showModal(mainTrackerModal).then(() => {
      interaction.editReply({
        embeds: [
          mainTrackerLinkSubmit(interaction.user.displayName, interaction.user.displayAvatarURL()),
        ],
        components: [],
      });
    });
  }

  if (interaction.customId === "resubmitOtherTrackers") {
    await interaction.showModal(otherTrackersModal).then(() => {
      interaction.editReply({
        embeds: [
          allOtherTrackersSubmit(interaction.user.displayName, interaction.user.displayAvatarURL()),
        ],
        components: [],
      });
    });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (
    !interaction.isButton() ||
    interaction.user.bot ||
    interaction.customId !== "submitOtherTrackers"
  )
    return;

  return await interaction.showModal(otherTrackersModal);
});

const otherTrackersRow = new ActionRowBuilder().addComponents(
  new ButtonBuilder().setCustomId("skipOtherTrackers").setLabel("N/A").setStyle(ButtonStyle.Danger),
  new ButtonBuilder()
    .setCustomId("submitOtherTrackers")
    .setLabel("Submit Trackers")
    .setStyle(ButtonStyle.Success)
);

const resubmitRow = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId("resubmitMainTracker")
    .setLabel("Resubmit Link")
    .setStyle(ButtonStyle.Danger)
);

const otherTrackersModal = new ModalBuilder()
  .setCustomId("otherTrackersModal")
  .setTitle("Alternate Tracker Link(s)")
  .addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("otherTrackerLinks")
        .setLabel("Tracker Link(s)")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("New line for each link")
    )
  );

const mainTrackerModal = new ModalBuilder()
  .setCustomId("mainTrackerModal")
  .setTitle("Main Tracker Link")
  .addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("mainTrackerLink")
        .setLabel("Tracker Link")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Tracker Link")
    )
  );

require("./nameInMythic.js");
