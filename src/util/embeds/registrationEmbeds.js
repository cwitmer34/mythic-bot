const { EmbedBuilder } = require("discord.js");

function alreadyRegistered(text, iconURL) {
  return new EmbedBuilder()
    .setTitle("Already registered")
    .setColor("#FF5555")
    .setDescription(
      "You are already registered. Please use `/profile` to view your profile. If you believe this is a mistake or have any questions, please contact our staff team."
    )
    .setFooter({ text, iconURL });
}

function agreeToRules(text, iconURL) {
  return new EmbedBuilder()
    .setTitle("Please agree to our rulebook")
    .setURL(
      "https://docs.google.com/document/d/16I6Zg0xeA9J1Z9j7OfO4Yzh1crwierGUNNyMAYU2Bas/edit?usp=sharing"
    )
    .setColor("#55FF55")
    .setDescription(
      "Please confirm that you have read and agree to our [rulebook](https://docs.google.com/document/d/16I6Zg0xeA9J1Z9j7OfO4Yzh1crwierGUNNyMAYU2Bas/edit?usp=sharing). All poor actions aligning with our rulebook will result in disciplinary action."
    )
    .setFooter({ text, iconURL });
}

function ageCheck(text, iconURL) {
  return new EmbedBuilder()
    .setTitle("How old are you?")
    .setColor("#55FF55")
    .setDescription(
      "Please select the age range that you fall into. This information is used to help understand our player demographic."
    )
    .setFooter({ text, iconURL });
}

function refferal(text, iconURL) {
  return new EmbedBuilder()
    .setTitle("How did you hear about us?")
    .setColor("#55FF55")
    .setDescription(
      "Please select the option that best describes how you heard about us. This information is used to help us better promote our brand and create more competition for our players."
    )
    .setFooter({ text, iconURL });
}

function automaticDenial(text, iconURL) {
  return new EmbedBuilder()
    .setTitle("Automatic Denial")
    .setColor("#FF5555")
    .setDescription(
      "You have been automatically denied registration. Please read our [rulebook](https://docs.google.com/document/d/16I6Zg0xeA9J1Z9j7OfO4Yzh1crwierGUNNyMAYU2Bas/edit?usp=sharing) for a better understanding of why. A few reasons this may hapen is if you're under the required age, have a bad history with our league, or are currently on a league suspension. Please contact our staff team if you believe this is a mistake."
    )
    .setFooter({ text, iconURL });
}

function registrationNotFound(text, iconURL) {
  return new EmbedBuilder()
    .setTitle("A Registration for this user was not found")
    .setColor("#FF5555")
    .setDescription(
      "Please use `/register` to restart the registration process. This typically happens when you take too long to reply to a prompt."
    );
}

function cancelRegistrationStart(text, iconURL) {
  return new EmbedBuilder()
    .setTitle("Registration cancelled")
    .setColor("#FF5555")
    .setDescription(
      "You have cancelled the registration process. You may start the registration process again by using `/register` at anytime."
    )
    .setFooter({ text, iconURL });
}

function prevActionReports(text, iconURL) {
  return new EmbedBuilder()
    .setTitle("Have you ever gotten into trouble in our league?")
    .setColor("#55FF55")
    .setDescription(
      "Have you ever been temporarily suspended, banned, muted, or had any other disciplinary action taken against you in Mythic Arena?"
    )
    .setFooter({ text, iconURL });
}

function sixMansRank(text, iconURL) {
  return new EmbedBuilder()
    .setTitle("What is your current 6mans rank?")
    .setColor("#55FF55")
    .setDescription(
      "Please select your current 6mans rank, if you have never played [Official NA 6mans](https://RL6mans.com) or have not played in the past 2 years - select N/A."
    )
    .setFooter({ text, iconURL });
}

function notYetRegistered(text, iconURL) {
  return new EmbedBuilder()
    .setTitle("Starting registration process")
    .setColor("#55FF55")
    .setDescription(
      "We are starting the registration process. This will take 2-3 minutes. Below please confirm that you would like to continue the registration process, if not please press cancel."
    )
    .setFooter({ text, iconURL });
}

function invalidMainTrackerLink(text, iconURL) {
  return new EmbedBuilder()
    .setTitle("Invalid Tracker Link")
    .setColor("#FF5555")
    .setDescription(
      "The link you provided is invalid. Please provide a valid [RLTracker](https://rocketleague.tracker.network) link."
    )
    .setFooter({ text, iconURL });
}

function mainTrackerLinkSubmit(text, iconURL) {
  return new EmbedBuilder()
    .setTitle("Main Tracker Link")
    .setColor("#FFFF55")
    .setDescription("Currently waiting for user to input their main tracker link...")
    .setFooter({ text, iconURL });
}

function invalidOtherTrackers(text, iconURL, trackers) {
  return new EmbedBuilder()
    .setTitle("Invalid Tracker Link")
    .setColor("#FF5555")
    .setDescription(
      `The following tracker link(s) are invalid: \n\n${trackers.join(
        ", "
      )}\n\n We have already saved the valid tracker link(s) you provided, so it is only necessary to resubmit the link(s) resolved as invalid. Please resubmit it/them, and if you accidentally submitted something you didn't mean to please press \`Next\`.`
    )
    .setFooter({ text, iconURL });
}

function nameAlreadyTaken(text, iconURL) {
  return new EmbedBuilder()
    .setTitle("Username already taken")
    .setColor("#FF5555")
    .setDescription(
      "It appears that this username is already taken. Please provide a different username."
    )
    .setFooter({ text, iconURL });
}

function nameInMythic(text, iconURL) {
  return new EmbedBuilder()
    .setTitle("Please choose a username")
    .setColor("#55FF55")
    .setDescription(
      "Please provide us with the username you'd like to use in Mythic. This name will remain the same throughout the season, and is completely unique to other players."
    )
    .setFooter({ text, iconURL });
}

function allOtherTrackersSubmit(text, iconURL) {
  return new EmbedBuilder()
    .setTitle("Alternate Tracker Links")
    .setColor("#FFFF55")
    .setDescription(
      "We require players to submit all alternate accounts that they own and have played on in the past **12 months**. Please click `Submit Trackers` to continue, or if you don't have any please press `N/A`)"
    )
    .setFooter({ text, iconURL });
}

function misclickHasActionReports(text, iconURL) {
  return new EmbedBuilder()
    .setTitle("Misclick Detected (5)")
    .setColor("#FF5555")
    .setDescription(
      "It appears you misclicked the option saying that you have action reports, because we can't find any record of it in our database!"
    )
    .setFooter({ text, iconURL });
}

function misclickHasBeenDenied(text, iconURL) {
  return new EmbedBuilder()
    .setColor("#FF5555")
    .setDescription(
      "It appears you misclicked the option saying that you've been denied, because we can't find any record of it in our database!"
    )
    .setFooter({ text, iconURL });
}

function prevDenied(text, iconURL) {
  return new EmbedBuilder()
    .setTitle("Have you been previously denied?")
    .setColor("#55FF55")
    .setDescription(
      "If you have previously been denied registration, please select `Yes` and provide the reason why. If not, please select `No`. Our database contains a list of all players who have been denied registration, if you're unhonest it will result in an automatic denial and action may be taken against you."
    )
    .setFooter({ text, iconURL });
}

function invalidNameEmbed(text, iconURL) {
  return new EmbedBuilder()
    .setTitle("Invalid Username")
    .setColor("Red")
    .setDescription(
      "The name you have provided is already taken by another active player in our league, please choose a different name. **Please note this name must match your RL in game name**."
    );
}

module.exports = {
  alreadyRegistered,
  notYetRegistered,
  cancelRegistrationStart,
  registrationNotFound,
  ageCheck,
  automaticDenial,
  refferal,
  prevDenied,
  misclickHasBeenDenied,
  prevActionReports,
  agreeToRules,
  misclickHasActionReports,
  sixMansRank,
  mainTrackerLink: mainTrackerLinkSubmit,
  invalidMainTrackerLink,
  invalidOtherTrackers,
  allOtherTrackersSubmit,
  nameInMythic,
  nameAlreadyTaken,
  invalidNameEmbed,
};
