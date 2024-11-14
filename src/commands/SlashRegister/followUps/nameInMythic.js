const { client } = require("../../../index.js");
const { playersCurrentlyRegistering } = require("../playerRegister.js");
const {
  nameInMythic,
  allOtherTrackersSubmit,
  invalidOtherTrackers,
} = require("../../../util/embeds/registrationEmbeds.js");
const { TextInputStyle, ButtonStyle } = require("discord.js");
const { TextInputBuilder } = require("discord.js");
const { ActionRowBuilder } = require("discord.js");
const { ModalBuilder } = require("discord.js");
const { validifyTrackers } = require("../../../util/trackersUtil.js");
const { ButtonBuilder } = require("discord.js");

client.on("interactionCreate", async (interaction) => {
  if (
    !interaction.isModalSubmit() ||
    interaction.user.bot ||
    interaction.customId !== "otherTrackersModal"
  )
    return;
  await interaction.deferUpdate();
  const alternateTrackers = interaction.fields.getTextInputValue("otherTrackerLinks").split("\n");

  const trackers = await validifyTrackers(alternateTrackers);

  if (trackers.invalid.length) {
    return interaction.editReply({
      embeds: [
        invalidOtherTrackers(
          interaction.user.displayName,
          interaction.user.displayAvatarURL(),
          trackers.invalid
        ),
      ],
      components: [resubmitRow],
    });
  } else {
    const existingTrackers =
      playersCurrentlyRegistering.get(interaction.user.id).alternateTrackers || [];
    playersCurrentlyRegistering.get(interaction.user.id).alternateTrackers = [
      ...existingTrackers,
      ...trackers.valid,
    ];
    return interaction.editReply({
      embeds: [nameInMythic(interaction.user.displayName, interaction.user.displayAvatarURL())],
      components: [nameRow],
    });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (
    interaction.isButton() &&
    !interaction.user.bot &&
    interaction.customId === "chooseMythicName"
  )
    return await interaction.showModal(nameModal);
});

client.on("interactionCreate", async (interaction) => {
  if (
    !interaction.isButton() ||
    interaction.user.bot ||
    interaction.customId !== "skipOtherTrackers"
  )
    return;

  playersCurrentlyRegistering.get(interaction.user.id).alternateTrackers = [];

  return await interaction.showModal(nameModal).then(() => {
    interaction.editReply({
      embeds: [nameInMythic(interaction.user.displayName, interaction.user.displayAvatarURL())],
      components: [nameRow],
    });
  });
});

const nameRow = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId("chooseMythicName")
    .setLabel("Choose name")
    .setStyle(ButtonStyle.Primary)
);

const resubmitRow = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId("skipOtherTrackers")
    .setLabel("Next")
    .setStyle(ButtonStyle.Primary),
  new ButtonBuilder()
    .setCustomId("resubmitOtherTrackers")
    .setLabel("Resubmit")
    .setStyle(ButtonStyle.Success)
);

const nameModal = new ModalBuilder()
  .setCustomId("mythicNameModal")
  .setTitle("Mythic Username")
  .addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("mythicName")
        .setLabel("Username in Mythic")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("Username (in game name)")
    )
  );

require("./submitForm.js");
