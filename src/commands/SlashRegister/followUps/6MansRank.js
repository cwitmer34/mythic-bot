const { client } = require("../../../index.js");
const { playersCurrentlyRegistering } = require("../playerRegister.js");
const { sixMansRank, automaticDenial } = require("../../../util/embeds/registrationEmbeds");
const {
  StringSelectMenuBuilder,
  ActionRowBuilder,
  StringSelectMenuComponent,
  StringSelectMenuInteraction,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

client.on("interactionCreate", async (interaction) => {
  if (
    !interaction.isButton() ||
    interaction.user.bot ||
    (interaction.customId !== "agreeToRules" && interaction.customId !== "disagreeToRules")
  )
    return;
  if (interaction.customId === "disagreeToRules") {
    return interaction.update({
      embeds: [automaticDenial(interaction.user.displayName, interaction.user.displayAvatarURL())],
      components: [],
    });
  }

  playersCurrentlyRegistering.get(interaction.user.id).agreeToRules = true;

  return interaction.update({
    embeds: [sixMansRank(interaction.user.displayName, interaction.user.displayAvatarURL())],
    components: [row],
  });
});

const row = new ActionRowBuilder().addComponents(
  new StringSelectMenuBuilder()
    .setCustomId("sixMansRankMenu")
    .addOptions(
      new StringSelectMenuOptionBuilder().setLabel("S/X").setValue("S/X"),
      new StringSelectMenuOptionBuilder().setLabel("A").setValue("A"),
      new StringSelectMenuOptionBuilder().setLabel("B+").setValue("B+"),
      new StringSelectMenuOptionBuilder().setLabel("B").setValue("B"),
      new StringSelectMenuOptionBuilder().setLabel("C").setValue("C"),
      new StringSelectMenuOptionBuilder().setLabel("D").setValue("D"),
      new StringSelectMenuOptionBuilder().setLabel("E").setValue("E"),
      new StringSelectMenuOptionBuilder().setLabel("H").setValue("H")
    )
);

require("./mainTrackerLink.js");
