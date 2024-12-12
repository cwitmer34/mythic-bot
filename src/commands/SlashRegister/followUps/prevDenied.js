const { ModalBuilder, ActionRowBuilder, TextInputStyle, ButtonStyle } = require("discord.js");
const { client } = require("../../../index.js");
const { playersCurrentlyRegistering } = require("../playerRegister.js");
const { TextInputBuilder } = require("@discordjs/builders");
const { prevDenied } = require("../../../util/embeds/registrationEmbeds.js");
const { StringSelectMenuBuilder } = require("@discordjs/builders");
const { ButtonBuilder } = require("@discordjs/builders");

async function handleRefferalMenu(interaction) {
  if (interaction.values[0] === "other" || interaction.values[0] === "friend") {
    await interaction.showModal(modal(interaction.values[0]));
  } else {
    playersCurrentlyRegistering.get(interaction.user.id).refferal = interaction.values[0];
    return interaction.update({
      embeds: [prevDenied(interaction.user.displayName, interaction.user.displayAvatarURL())],
      components: [row],
    });
  }
}

async function handleRefferalModal(interaction) {
  const refferal = interaction.fields.getTextInputValue("refferalInput");
  playersCurrentlyRegistering.get(interaction.user.id).refferal = refferal;
  console.log(playersCurrentlyRegistering.get(interaction.user.id));
  return interaction.update({
    embeds: [prevDenied(interaction.user.displayName, interaction.user.displayAvatarURL())],
    components: [row],
  });
}

const row = new ActionRowBuilder().addComponents(
  new ButtonBuilder().setCustomId("hasBeenDenied").setLabel("Yes").setStyle(ButtonStyle.Primary),
  new ButtonBuilder().setCustomId("hasntBeenDenied").setLabel("No").setStyle(ButtonStyle.Success)
);

const modal = (type) => {
  return new ModalBuilder()
    .setCustomId("refferalModal")
    .setTitle("Misc. Refferal")
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("refferalInput")
          .setLabel(
            type === "other"
              ? "Please specify how you heard about us"
              : "Please specify who reffered you"
          )
          .setStyle(TextInputStyle.Short)
          .setPlaceholder(type === "other" ? "Other" : "Friend's name")
      )
    );
};

require("./hasBeenDenied.js");

module.exports = { handleRefferalMenu, handleRefferalModal };
