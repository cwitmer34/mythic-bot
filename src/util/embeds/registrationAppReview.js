const { EmbedBuilder } = require("discord.js");

function endReviewEmbed(username) {
  return new EmbedBuilder()
    .setTitle("Review Process Ended")
    .setColor("Red")
    .setDescription(
      "You have ended the review process. If you would like to review more applications, please use `/reviewapps` again."
    )
    .setFooter({ text: `Ended by ${username}` });
}

function currentAppEmbed(doc) {
  const embed = new EmbedBuilder()
    .setTitle(`${doc.username}'s Application`)
    .setDescription(
      "This is the current application being reviewed. Please view their tracker(s), ensure they're a valid player (not smurfing/sandbagging) and then formulate their salary. It is your final judgement to adjust the salary as you see fit.\n\n *If you are unsure about this application, please press skip and someone else will get to it*"
    )
    .setFooter({ text: `Application ID: ${doc.id}` })
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

module.exports = { currentAppEmbed, endReviewEmbed };
