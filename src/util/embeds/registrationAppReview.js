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

function noMoreAppsEmbed(username) {
  return new EmbedBuilder()
    .setTitle("No More Applications")
    .setColor("Green")
    .setDescription(
      "There are no more applications to review. Please check back later when more players have applied."
    )
    .setFooter({ text: `Ended by ${username}` });
}

function currentAppEmbed(doc) {
  const embed = new EmbedBuilder()
    .setTitle(`${doc.username}'s Application`)
    .setDescription(
      "This is the current application being reviewed. Please view their tracker(s), ensure they're a valid player (not smurfing/sandbagging) and then use `/getsalary` with the bot for it to assist with the expected salary. It is your final judgement to adjust the salary as you see fit.\n\n *If you are unsure about this application, please press skip and someone else will get to it*"
    )
    .setFooter({ text: `Application ID: ${doc._id}` })
    .addFields([
      {
        name: "Mythic (in-game) Name",
        value: `${doc.username}`,
        inline: true,
      },
      {
        name: "6Mans Rank",
        value: `${doc.rank}`,
        inline: true,
      },
      {
        name: "Main Tracker",
        value: `[Tracker 1](${doc.mainTracker})`,
      },
      {
        name: "Alternate Trackers",
        value: Array.isArray(doc.alternateTrackers)
          ? doc.alternateTrackers
              .map((tracker, index) => `[Tracker ${index + 2}](${tracker})`)
              .join(",\n ")
          : "No alternate trackers provided",
        inline: true,
      },
      {
        name: "Rules Acknowledged",
        value: `${doc.agreeToRules}`,
        inline: true,
      },
    ]);
  if (doc.actionReports) {
    embed.addFields([
      {
        name: "User explanation of report(s)",
        value: `${doc.actionReports.reasonForReports}`,
      },
      { name: "Report(s) Appeal", value: `${doc.actionReports.actionReportsAppeal}` },
    ]);
  }
  if (doc.denial) {
    embed.addFields([
      {
        name: "User explanation of denial(s)",
        value: `${doc.denial.reasonForDenial}`,
      },
      { name: "Denial(s) Appeal", value: `${doc.denial.denialAppeal}`, nline: true },
    ]);
  }
  return embed;
}

module.exports = { currentAppEmbed, endReviewEmbed, noMoreAppsEmbed };
