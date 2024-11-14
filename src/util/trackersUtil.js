const { default: axios } = require("axios");
const { playersCurrentlyRegistering } = require("../commands/SlashRegister/playerRegister.js");
const { allOtherTrackersSubmit } = require("./embeds/registrationEmbeds.js");

const trackerLinkPattern = /\/profile\/[^\/]+\/[^\/]+/;

async function validifyTrackers(trackerLinks) {
  const trackers = { valid: [], invalid: [] };
  for (const trackerLink of trackerLinks) {
    if (!trackerLinkPattern.test(trackerLink)) {
      trackers.invalid.push(trackerLink);
    } else {
      const res = await axios.get(trackerLink).catch((err) => {
        console.log(err);
      });
      if (res.status !== 200) trackers.invalid.push(trackerLink);
      else trackers.valid.push(trackerLink);
    }
  }
  console.log(trackers);
  return trackers;
}

module.exports = { validifyTrackers };
