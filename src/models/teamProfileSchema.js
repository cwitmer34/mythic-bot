const { Schema, model } = require("mongoose");

const teamProfileSchema = new Schema({
  matchId: String,
  teams: [String],
  games: [JSON],
  replayGroupLink: String,
});

module.exports = model("TeamProfile", teamProfileSchema);
