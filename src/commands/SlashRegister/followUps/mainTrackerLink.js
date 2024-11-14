const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require("discord.js");
const { client } = require("../../../index.js");
const {
  mainTrackerLink: mainTrackerLinkSubmit,
} = require("../../../util/embeds/registrationEmbeds.js");
const { playersCurrentlyRegistering } = require("../playerRegister.js");

client.on("interactionCreate", async (interaction) => {
  if (
    !interaction.isStringSelectMenu() ||
    interaction.user.bot ||
    interaction.customId !== "sixMansRankMenu"
  )
    return;

  const rank = interaction.values[0];
  playersCurrentlyRegistering.get(interaction.user.id).rank = rank;
  console.log(
    playersCurrentlyRegistering.get(interaction.user.id) +
      " checking to make sure all data is added to map"
  );

  await interaction.showModal(modal).then(() => {
    interaction.editReply({
      embeds: [
        mainTrackerLinkSubmit(interaction.user.displayName, interaction.user.displayAvatarURL()),
      ],
      components: [],
    });
  });
});

const modal = new ModalBuilder()
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

require("./allOtherTrackers.js");
