const { Schema, model } = require("mongoose");

const registrationAppSchema = new Schema({
  age: String,
  refferal: String,
  actionReports: {
    reasonForReports: String,
    actionReportsAppeal: String,
  },
  agreeToRules: Boolean,
  sixMansRank: String,
  mainTracker: String,
  alternateTrackers: [String],
  username: String,
});

module.exports = model("RegistrationApp", registrationAppSchema);
