const { EmbedBuilder } = require("discord.js");

function currentAppEmbed(doc) {
  const embed = new EmbedBuilder()
    .setTitle(`${doc.username}'s Application`)
    .setDescription(
      "This is the current application being reviewed. There are buttons below to accept or deny the application."
    )
    .addFields([
      {
        name: "Mythic (in-game) Name",
        value: `${doc.username}`,
      },
      {
        name: "6Mans Rank",
        value: `${doc.rank}`,
      },
      {
        name: "Main Tracker",
        value: `${doc.mainTracker}`,
      },
      {
        name: "Alternate Trackers",
        value: `${doc.alternateTrackers.join(", ")}`,
      },
      {
        name: "Rules Acknowledged",
        value: `${doc.agreeToRules}`,
      },
    ]);
  if (doc.actionReports) {
    embed.addField("User explanation of report(s)", `${doc.actionReports.reasonForReports}`);
    embed.addField("Report(s) Appeal", `${doc.actionReports.actionReportsAppeal}`);
  }
  if (doc.denial) {
    embed.addFields("User explanation of past denial", `${doc.denial.reasonForDenial}`);
    embed.addFields("Denial Appeal", `${doc.denial.appeal}`);
  }
  return embed;
}

module.exports = { currentAppEmbed };
