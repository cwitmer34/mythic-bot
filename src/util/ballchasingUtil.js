const { BallChasingAPI } = require("ballchasing");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const { randomUUID } = require("crypto");
const { submitTeamStats } = require("../ballchasing/interactions/submitGroup.js");
const { addOrUpdatePlayers } = require("../sheets");
require("dotenv").config();
const bc = new BallChasingAPI(process.env.BALLCHASING_API_KEY);

async function getTeamStats({ groupId, teamName }) {
  console.log(`${teamName} - team name`);
  const data = await axios
    .get(`https://ballchasing.com/api/groups/${groupId}`, {
      headers: { Authorization: process.env.BALLCHASING_API_KEY },
    })
    .then((res) => res.data);
  console.log(data);
  const team = data.teams.find((team) => team.name === teamName);
  if (!team) {
    throw new Error(`Team with name ${teamName} not found in group ${groupId}`);
  }
  const playerStats = {};
  data.players.forEach((player) => {
    if (player.team === teamName) {
      stats = player.cumulative;
      playerStats[player.name] = [
        stats.core.goals,
        stats.core.assists,
        stats.core.saves,
        stats.core.shots,
        stats.demo.inflicted,
      ];
    }
  });
  console.log(playerStats);
  return playerStats;
}

async function createGroupAndUploadStats(filePaths, groupName, teamName) {
  const groupId = await createGroup(groupName);
  console.log(`Group ID: ${groupId}`);
  for (const filePath of filePaths) {
    await uploadOrAddToGroup(filePath, groupId);
  }
  try {
    const playerStats = await getTeamStats({ groupId, teamName });
    await addOrUpdatePlayers(playerStats);
    console.log("Group stats submitted successfully.");
  } catch (error) {
    console.error("Error submitting group stats:", error);
  }
}
async function getAllStats(groupId) {
  throw new Error("Not implemented");
}

async function createGroup(groupName) {
  try {
    const response = await axios.post(
      "https://ballchasing.com/api/groups",
      {
        name: randomUUID(),
        player_identification: "by-id",
        team_identification: "by-player-clusters",
      },
      {
        headers: {
          Authorization: process.env.BALLCHASING_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 201) {
      console.log("Group successfully created");
      console.log(response.data);
      return response.data.id;
    } else {
      throw new Error(`Unexpected status code: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
}

async function uploadOrAddToGroup(path, groupId) {
  const file = fs.createReadStream(path);
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      `https://ballchasing.com/api/v2/upload?group=${groupId}&visibility=public`,
      formData,
      {
        headers: {
          "Content-Type": `multipart/form-data`,
          Authorization: process.env.BALLCHASING_API_KEY,
        },
      }
    );
    console.log(`replay response:${response}`);
    if (response.status === 201) {
      console.log("replay uploaded");
      return response.data.id;
    }
  } catch (error) {
    // console.log(`is error`);
    // console.log(error);
    if (error.response.status === 409) {
      try {
        const res = await axios.patch(
          `https://ballchasing.com/api/replays/${error.response.data.id}`,
          {
            group: groupId,
            visibility: "public",
          },
          {
            headers: {
              Authorization: process.env.BALLCHASING_API_KEY,
            },
          }
        );
        console.log(`res.status: ${res.status}`);
      } catch (error) {
        console.log("Error fetching replay");
        console.log(`error.response.status: ${error.response.status}`);
        throw error;
      }
    }
  }
}

module.exports = { getTeamStats, getAllStats, createGroupAndUploadStats, createGroup };
