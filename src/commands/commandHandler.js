const { client } = require("../index.js");
const { confirmRegistrationStart } = require("./SlashRegister/followUps/ageCheck.js");
const {
  handleClaimsActionReports,
  handleClaimsNoActionReports,
  handleActionReportsModal,
} = require("./SlashRegister/followUps/agreeToRules.js");
const {
  handleHasBeenDenied,
  handleHasntBeenDenied,
  handleDenialModal,
} = require("./SlashRegister/followUps/hasBeenDenied.js");
const { handleRefferalModal } = require("./SlashRegister/followUps/prevDenied.js");
const { handleRefferalMenu, handleAgeSelection } = require("./SlashRegister/followUps/refferal.js");
const {
  startRegistrationProcess,
  cancelRegistrationProcess,
} = require("./SlashRegister/playerRegister.js");

client.on("interactionCreate", async (interaction) => {
  // SlashRegister
  if (interaction.isCommand() && interaction.commandName === "register" && !interaction.user.bot)
    startRegistrationProcess(interaction);

  if (
    interaction.isButton() &&
    !interaction.user.bot &&
    interaction.customId === "cancelRegistrationStart"
  )
    cancelRegistrationProcess(interaction);

  if (
    interaction.isButton() &&
    !interaction.user.bot &&
    interaction.customId === "confirmRegistrationStart"
  )
    confirmRegistrationStart(interaction);
  if (
    interaction.isStringSelectMenu() &&
    !interaction.user.bot &&
    interaction.customId === "ageCheckMenu"
  )
    handleAgeSelection(interaction);

  if (
    interaction.isStringSelectMenu() &&
    !interaction.user.bot &&
    interaction.customId === "refferalMenu"
  )
    handleRefferalMenu(interaction);

  if (
    interaction.isModalSubmit() &&
    !interaction.user.bot &&
    interaction.customId === "refferalModal"
  )
    handleRefferalModal(interaction);

  if (interaction.customId === "hasBeenDenied" && interaction.isButton() && !interaction.user.bot)
    handleHasBeenDenied(interaction);

  if (interaction.customId === "hasntBeenDenied" && interaction.isButton() && !interaction.user.bot)
    handleHasntBeenDenied(interaction);
  if (
    interaction.isModalSubmit() &&
    !interaction.user.bot &&
    interaction.customId === "denialModal"
  )
    handleDenialModal(interaction);

  if (
    interaction.isButton &&
    !interaction.user.bot &&
    interaction.customId === "claimsActionReports"
  )
    handleClaimsActionReports(interaction);
  if (
    interaction.isButton &&
    !interaction.user.bot &&
    interaction.customId === "claimsActionReports"
  )
    handleClaimsNoActionReports(interaction);

  if (
    interaction.isModalSubmit() &&
    !interaction.user.bot &&
    interaction.customId === "actionReportsModal"
  )
    handleActionReportsModal(interaction);
});
