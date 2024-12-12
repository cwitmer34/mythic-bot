const { client } = require("../../index");
const mongo = require("../../mongo");

client.on("interactionCreate", async (interaction) => {
  if (
    !interaction.isCommand() ||
    interaction.commandName !== "createschedule" ||
    interaction.user.bot
  )
    return;

  const teams = await mongo.fetchTeams();

  const schedule = generateSchedule(teams);

  let teamSchedules = {};

  schedule.forEach((week) => {
    week.forEach((match) => {
      if (!teamSchedules[match.home]) {
        teamSchedules[match.home] = [];
      }
      if (!teamSchedules[match.away]) {
        teamSchedules[match.away] = [];
      }
      teamSchedules[match.home].push({ opponent: match.away, home: true });
      teamSchedules[match.away].push({ opponent: match.home, home: false });
    });
  });

  await mongo.setTeamSchedules(Object.keys(teamSchedules), Object.values(teamSchedules));

  console.log(JSON.stringify(teamSchedules[10]));

  // for (match of schedule) {
  //   console.log(match);
  // }
});

function generateSchedule(teams) {
  const schedule = [];
  const totalTeams = teams.length;
  const totalWeeks = (totalTeams - 1) * 2; // Each team plays every other team twice

  for (let i = 0; i < totalWeeks; i++) {
    const week = [];
    for (let j = 0; j < totalTeams / 2; j++) {
      const home = i < totalTeams - 1 ? teams[j].id : teams[totalTeams - 1 - j].id;
      const away = i < totalTeams - 1 ? teams[totalTeams - 1 - j].id : teams[j].id;
      week.push({ home, away });
    }
    schedule.push(week);

    // Rotate teams except the anchor team
    const lastTeam = teams.pop();
    teams.splice(1, 0, lastTeam);

    // Reverse the teams array after the first round to create home and away matches
    if (i === totalTeams - 2) {
      teams.reverse();
    }
  }

  // Add one last series of matchups to the beginning of the schedule, randomized
  const lastSeries = [];
  const shuffledTeams = teams.slice().sort(() => Math.random() - 0.5);
  for (let i = 0; i < totalTeams / 2; i++) {
    lastSeries.push({
      home: shuffledTeams[i].id,
      away: shuffledTeams[totalTeams - 1 - i].id,
    });
  }
  schedule.unshift(lastSeries);

  return schedule;
}
