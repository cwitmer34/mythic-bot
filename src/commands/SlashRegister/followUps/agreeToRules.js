const { ModalBuilder } = require("@discordjs/builders");
const { client } = require("../../../index");
const mongo = require("../../../mongo");
const { playersCurrentlyRegistering } = require("../playerRegister.js");
const {
  agreeToRules,
  automaticDenial,
  misclickHasActionReports,
} = require("../../../util/embeds/registrationEmbeds.js");
const { ButtonStyle, TextInputStyle } = require("discord.js");
const { ActionRowBuilder } = require("@discordjs/builders");
const { ButtonBuilder } = require("@discordjs/builders");
const { TextInputBuilder } = require("@discordjs/builders");

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton() || interaction.user.bot) return;
  if (interaction.customId === "claimsActionReports") {
    const hasActionReports = await mongo.hasActionReports(interaction.user.id);

    if (hasActionReports) {
      await interaction.showModal(modal);
    } else {
      const embed = misclickHasActionReports(
        interaction.user.displayName,
        interaction.user.displayAvatarURL()
      );

      await interaction.update({
        embeds: [embed],
        components: [],
      });
      for (let i = 5; i >= 0; i--) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        embed.setTitle(`Misclick Detected (${i})`);
        await interaction.editReply({
          embeds: [embed],
          components: [],
        });
      }

      return interaction.followUp({
        embeds: [agreeToRules(interaction.user.displayName, interaction.user.displayAvatarURL())],
        components: [row],
      });
    }
  } else if (interaction.customId === "claimsNoActionReports") {
    const hasActionReports = await mongo.hasActionReports(interaction.user.id);
    if (hasActionReports) {
      playersCurrentlyRegistering.delete(interaction.user.id);
      return interaction.update({
        embeds: [
          automaticDenial(interaction.user.displayName, interaction.user.displayAvatarURL()),
        ],
        components: [],
      });
    } else {
      return interaction.update({
        embeds: [agreeToRules(interaction.user.displayName, interaction.user.displayAvatarURL())],
        components: [row],
      });
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  if (
    !interaction.isModalSubmit() ||
    interaction.user.bot ||
    interaction.customId !== "actionReportsModal"
  )
    return;

  const reasonForReports = interaction.fields.getTextInputValue("reasonForReports");
  const actionReportsAppeal = interaction.fields.getTextInputValue("actionReportsAppeal");
  playersCurrentlyRegistering.get(interaction.user.id).actionReports = {
    reasonForReports,
    actionReportsAppeal,
  };

  return interaction.update({
    embeds: [agreeToRules(interaction.user.displayName, interaction.user.displayAvatarURL())],
    components: [row],
  });
});

const row = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId("disagreeToRules")
    .setLabel("Disagree")
    .setStyle(ButtonStyle.Danger),
  new ButtonBuilder().setCustomId("agreeToRules").setLabel("Agree").setStyle(ButtonStyle.Success)
);

const modal = new ModalBuilder()
  .setCustomId("actionReportsModal")
  .setTitle("Questions about your action reports")
  .addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("reasonForReports")
        .setLabel("Please explain your action reports")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("Reason")
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("actionReportsAppeal")
        .setLabel("Why should you be allowed to register")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("Appeal")
    )
  );

require("./6MansRank.js");
