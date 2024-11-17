const { EmbedBuilder, ButtonStyle } = require("discord.js");
const { client } = require("../../../index.js");
const { playersCurrentlyRegistering } = require("../playerRegister.js");
const { MessageEmbed } = require("discord.js");
const mongo = require("../../../mongo.js");
const { nameRow } = require("./nameInMythic.js");
const { invalidNameEmbed } = require("../../../util/embeds/registrationEmbeds.js");
const { ButtonBuilder } = require("discord.js");
const { ActionRowBuilder } = require("discord.js");

client.on("interactionCreate", async (interaction) => {
  if (
    !interaction.isModalSubmit() ||
    interaction.user.bot ||
    interaction.customId !== "mythicNameModal"
  )
    return;

  await interaction.deferUpdate();
  const amountOfActionReports = await mongo.amountOfActionReports(interaction.user.id);
  const amountOfDeniedApps = await mongo.amountOfDeniedApps(interaction.user.id);
  const username = interaction.fields.getTextInputValue("mythicName");

  const nameRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("chooseMythicName")
      .setLabel("Choose name")
      .setStyle(ButtonStyle.Primary)
  );

  if (await mongo.invalidName(username)) {
    return await interaction.editReply({
      embeds: [invalidNameEmbed(interaction.user.id, interaction.user.displayAvatarURL())],
      components: [nameRow],
    });
  }

  const player = playersCurrentlyRegistering.get(interaction.user.id);
  player.username = username;
  player.playerId = interaction.user.id;
  let alternateTrackersFormatted;

  if (player.alternateTrackers.length === 0) {
    alternateTrackersFormatted = "None";
  } else player.alternateTrackers.join("\n");

  const embed = new EmbedBuilder()
    .setTitle("Application Information")
    .setColor("#0099ff")
    .setDescription(
      "Below is some of the information you submitted for your application, if you believe there is an error - please submit a support ticket and notify a staff member."
    )
    .addFields([
      { name: "Mythic (in-game) Name", value: `${player.username}`, inline: true },
      { name: "6Mans Rank", value: `${player.rank}`, inline: true },
      { name: "Main Tracker", value: `${player.mainTracker}`, inline: false },
      { name: "Alternate Trackers", value: `${alternateTrackersFormatted}`, inline: false },
      { name: "Action Reports", value: `${amountOfActionReports}`, inline: true },
      { name: "Denied Applications", value: `${amountOfDeniedApps}`, inline: true },
      { name: "Rules Acknowledged", value: `${player.agreeToRules}`, inline: true },
    ]);

  await mongo.saveRegistrationApp(player);
  return interaction.editReply({ embeds: [embed], components: [], ephemeral: true });
});
