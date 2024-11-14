const { Schema, model } = require("mongoose");

const actionReportSchema = new Schema({
  discordId: String,
  dateIssued: Date,
  dateResolved: Date,
  expirationDate: Date,
  reason: String,
  actionTaken: String,
  givenBy: String,
  resolvedBy: String,
  resolved: Boolean,
  appeal: String,
});

module.exports = model("ActionReport", actionReportSchema);
