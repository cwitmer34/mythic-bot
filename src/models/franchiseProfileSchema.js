const { Schema, model } = require("mongoose");

const franchiseProfileSchema = new Schema({
  franchiseId: String,
  name: String,
  teams: [String],
  gm: String,
  agms: [String],
});

module.exports = model("FranchiseProfile", franchiseProfileSchema);
