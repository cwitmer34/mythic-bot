const { EmbedBuilder } = require("discord.js");

const InternalError = new EmbedBuilder()
  .setTitle("Internal Error")
  .setColor("#FF5555")
  .setDescription(
    "An internal error has occured. Please try again later, and notify staff of the issue."
  );

module.exports = { InternalError, AlreadyRegistered };
