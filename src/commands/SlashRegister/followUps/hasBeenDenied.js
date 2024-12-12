const { client } = require("../../../index.js");
const { playersCurrentlyRegistering } = require("../playerRegister.js");
const { TextInputBuilder } = require("@discordjs/builders");
const mongo = require("../../../mongo");
const {
  automaticDenial,
  misclickHasBeenDenied,
  prevActionReports,
} = require("../../../util/embeds/registrationEmbeds.js");
const { ActionRowBuilder } = require("@discordjs/builders");
const { ButtonBuilder } = require("@discordjs/builders");
const { ButtonStyle, TextInputStyle } = require("discord.js");
const { ModalBuilder } = require("@discordjs/builders");

async function handleHasBeenDenied(interaction) {
  const hasBeenDenied = await mongo.hasBeenDenied(interaction.user.id);
  if (hasBeenDenied) {
    await interaction.showModal(modal);
  } else {
    return interaction.update({
      embeds: [
        prevActionReports(interaction.user.displayName, interaction.user.displayAvatarURL()),
      ],
      components: [row],
    });
  }
}

async function handleHasntBeenDenied(interaction) {
  const hasBeenDenied = await mongo.hasBeenDenied(interaction.user.id);
  if (hasBeenDenied) {
    playersCurrentlyRegistering.delete(interaction.user.id);
    return interaction.update({
      embeds: [automaticDenial(interaction.user.displayName, interaction.user.displayAvatarURL())],
      components: [],
    });
  } else {
    const embed = misclickHasBeenDenied(
      interaction.user.displayName,
      interaction.user.displayAvatarURL()
    );
    embed.setTitle(`Misclick Detected (5)`);
    await interaction.update({
      embeds: [embed],
      components: [],
    });
    for (let i = 4; i >= 0; i--) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      embed.setTitle(`Misclick Detected (${i})`);
      await interaction.editReply({
        embeds: [embed],
      });
    }

    return interaction.editReply({
      embeds: [
        prevActionReports(interaction.user.displayName, interaction.user.displayAvatarURL()),
      ],
      components: [row],
    });
  }
}

async function handleDenialModal(interaction) {
  const reasonForDenial = interaction.fields.getTextInputValue("reasonForDenial");
  const appeal = interaction.fields.getTextInputValue("denialAppeal");
  playersCurrentlyRegistering.get(interaction.user.id).denial = {
    reasonForDenial,
    appeal,
  };
  return interaction.update({
    embeds: [prevActionReports(interaction.user.displayName, interaction.user.displayAvatarURL())],
    components: [row],
  });
}

const row = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId("claimsActionReports")
    .setLabel("Yes")
    .setStyle(ButtonStyle.Primary),
  new ButtonBuilder()
    .setCustomId("claimsNoActionReports")
    .setLabel("No")
    .setStyle(ButtonStyle.Success)
);

const modal = new ModalBuilder()
  .setCustomId("denialModal")
  .setTitle("Questions about your denial")
  .addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("reasonForDenial")
        .setLabel("Please explain why you were denied")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("Reason")
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("denialAppeal")
        .setLabel("Why should you be allowed to register")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("Appeal")
    )
  );

require("./agreeToRules.js");

module.exports = { handleHasBeenDenied, handleHasntBeenDenied, handleDenialModal };
