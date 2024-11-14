const { client } = require("../../../index");
const { playersCurrentlyRegistering } = require("../playerRegister");
const {
  registrationNotFound,
  ageCheck,
  automaticDenial,
} = require("../../../util/embeds/registrationEmbeds");
const {
  SelectMenuBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuComponent,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
} = require("discord.js");

client.on("interactionCreate", async (interaction) => {
  if (
    !interaction.isButton() ||
    interaction.user.bot ||
    interaction.customId !== "confirmRegistrationStart"
  )
    return;

  playersCurrentlyRegistering.set(interaction.user.id, {});

  return interaction.update({
    embeds: [ageCheck(interaction.user.displayName, interaction.user.displayAvatarURL())],
    components: [row],
  });
});

const row = new ActionRowBuilder().addComponents(
  new StringSelectMenuBuilder()
    .setCustomId("ageCheckMenu")
    .addOptions(
      new StringSelectMenuOptionBuilder().setLabel("13-15").setValue("notOldEnough"),
      new StringSelectMenuOptionBuilder().setLabel("16-18").setValue("16-18"),
      new StringSelectMenuOptionBuilder().setLabel("19-22").setValue("19-22"),
      new StringSelectMenuOptionBuilder().setLabel("23-25").setValue("23-25"),
      new StringSelectMenuOptionBuilder().setLabel("26-29").setValue("26-29"),
      new StringSelectMenuOptionBuilder().setLabel("30+").setValue("30+")
    )
);

require("./refferal");
