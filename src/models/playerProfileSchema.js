const { Schema, model } = require("mongoose");

const playerProfileSchema = new Schema({
  playerId: String,
  username: String,
  teamId: String,
  platform: String,
  mainTracker: String,
  alternateTrackers: [String],
  gamesPlayed: Number,
  wins: Number,
  losses: Number,
  goals: Number,
  assists: Number,
  saves: Number,
  shots: Number,
  demos: Number,
  salary: Number,
});

module.exports = model("PlayerProfile", playerProfileSchema);
