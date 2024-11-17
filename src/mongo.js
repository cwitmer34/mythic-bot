const mongoose = require("mongoose");
const config = require("./config.json");

class MongoDB {
  constructor() {
    this.connect();
  }

  async connect() {
    console.log(config.mongoUri);
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (mongoose.connection.readyState === 1) {
      console.log("Connected to MongoDB");
    } else {
      console.log(`Failed to connect to MongoDB, ready state is ${mongoose.connection.readyState}`);
    }
  }

  async saveRegistrationApp(player) {
    await mongoose.connection
      .useDb("mythicdatabase")
      .collection("openApplications")
      .insertOne(player);
  }

  async deleteRegistrationApp(id) {
    await mongoose.connection.useDb("mythicdatabase").collection("openApplications").deleteOne({
      _id: id,
    });
  }

  async checkPlayerRegistration(playerID) {
    const player = await mongoose.connection
      .useDb("mythicdatabase")
      .collection("players")
      .findOne({ id: playerID });
    return !!player;
  }

  async fetchRegistrationApps(docsToExclude = []) {
    return await mongoose.connection
      .useDb("mythicdatabase")
      .collection("openApplications")
      .find({ _id: { $nin: docsToExclude } })
      .sort({ _id: 1 })
      .limit(3)
      .toArray();
  }

  async hasActionReports(playerID) {
    const actionReports = await mongoose.connection
      .useDb("mythicdatabase")
      .collection("actionReports")
      .findOne({ id: playerID });
    return actionReports !== null;
  }

  async hasBeenDenied(playerID) {
    const denials = await mongoose.connection
      .useDb("mythicdatabase")
      .collection("previousDenials")
      .findOne({ id: playerID });
    return denials !== null;
  }

  async fetchPlayersDeniedApps(playerID) {
    return await mongoose.connection
      .useDb("mythicdatabase")
      .collection("previousDenials")
      .find({ id: playerID });
  }

  async amountOfDeniedApps(playerID) {
    return await mongoose.connection
      .useDb("mythicdatabase")
      .collection("previousDenials")
      .countDocuments({ id: playerID });
  }

  async amountOfActionReports(playerID) {
    return await mongoose.connection
      .useDb("mythicdatabase")
      .collection("actionReports")
      .countDocuments({ id: playerID });
  }

  async fetchPlayerActionReports(playerID) {
    return await mongoose.connection
      .useDb("mythicdatabase")
      .collection("actionReports")
      .find({ id: playerID });
  }

  async getPlayerCount() {
    return await mongoose.connection.useDb("mythicdatabase").collection("players").countDocuments();
  }

  async isConnected() {
    return mongoose.connection.readyState === 1;
  }

  async savePlayer(player, salary) {
    await mongoose.connection
      .useDb("mythicdatabase")
      .collection("players")
      .insertOne({ ...player, salary });
  }

  async getPlayer(playerID) {
    return await mongoose.connection
      .useDb("mythicdatabase")
      .collection("players")
      .findOne({ id: playerID });
  }

  async invalidName(username) {
    return await mongoose.connection.useDb("mythicdatabase").collection("players").findOne();
  }
}

const mongo = new MongoDB();
module.exports = mongo;
