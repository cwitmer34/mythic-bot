async function messageUser(member, embed) {
  try {
    await member.send({ embeds: [embed] });
  } catch (e) {
    console.log(e);
  }
}

module.exports = { messageUser };
