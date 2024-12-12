const { client } = require("../../../index.js");

const { playersCurrentlyRegistering } = require("../playerRegister.js");
const {
  automaticDenial,
  refferal: refferal,
} = require("../../../util/embeds/registrationEmbeds.js");
const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");
const { handleRefferalMenu } = require("./prevDenied");

async function handleAgeSelection(interaction) {
  if (interaction.values[0] === "notOldEnough") {
    playersCurrentlyRegistering.delete(interaction.user.id);
    return interaction.update({
      embeds: [automaticDenial(interaction.user.displayName, interaction.user.displayAvatarURL())],
      components: [],
    });
  }

  const age = interaction.values[0];
  playersCurrentlyRegistering.set(interaction.user.id, { age });
  return interaction.update({
    embeds: [refferal(interaction.user.displayName, interaction.user.displayAvatarURL())],
    components: [row],
  });
}

const row = new ActionRowBuilder().addComponents(
  new StringSelectMenuBuilder()
    .addOptions(
      new StringSelectMenuOptionBuilder().setLabel("Twitter/X").setValue("twitter"),
      new StringSelectMenuOptionBuilder().setLabel("Rocket League Discord").setValue("rlDiscord"),
      new StringSelectMenuOptionBuilder().setLabel("Discord").setValue("discord"),
      new StringSelectMenuOptionBuilder().setLabel("Reddit").setValue("reddit"),
      new StringSelectMenuOptionBuilder().setLabel("Friend").setValue("friend"),
      new StringSelectMenuOptionBuilder().setLabel("Other").setValue("other")
    )
    .setCustomId("refferalMenu")
);

require("./prevDenied");

module.exports = { handleAgeSelection, handleRefferalMenu };
