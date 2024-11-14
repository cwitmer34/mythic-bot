const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { client } = require("../../index");
const { mongo } = require("../../mongo");
const {
  alreadyRegistered,
  notYetRegistered,
  cancelRegistrationStart,
} = require("../../util/embeds/registrationEmbeds");

const playersCurrentlyRegistering = new Map();

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand() || interaction.commandName !== "register" || interaction.user.bot)
    return;
  const isRegistered = await mongo.checkPlayerRegistration(interaction.user.id);
  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("cancelRegistrationStart")
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId("confirmRegistrationStart")
      .setLabel("Confirm")
      .setStyle(ButtonStyle.Success)
  );
  return interaction.reply({
    embeds: [
      isRegistered
        ? alreadyRegistered(interaction.user.displayName, interaction.user.displayAvatarURL())
        : notYetRegistered(interaction.user.displayName, interaction.user.displayAvatarURL()),
    ],
    ephemeral: true,
    components: [isRegistered ? [] : buttons],
  });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton() || interaction.user.bot) return;
  if (interaction.customId === "cancelRegistrationStart") {
    return interaction.update({
      embeds: [
        cancelRegistrationStart(interaction.user.displayName, interaction.user.displayAvatarURL()),
      ],
      components: [],
    });
  }
});

module.exports = { playersCurrentlyRegistering };

require("./followUps/ageCheck");
