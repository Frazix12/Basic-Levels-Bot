const { Client, CommandInteraction, MessageAttachment } = require("discord.js");
const Levels = require("discord-xp");
const canvacord = require("canvacord");
module.exports = {
  name: "rank",
  description: "rank command",
  type: "CHAT_INPUT",
  options: [
    {
      name: "user",
      description: "User",
      type: 6,
      required: true,
    },
  ],
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    const target = interaction.options.getMember("user");

    const user = await Levels.fetch(target.id, interaction.guild.id, true); // Selects the target from the database.
    let reqXp = Levels.xpFor(parseInt(user.level) + 1);
    if (!user)
      return interaction.followUp(
        "Seems like this user has not earned any xp so far."
      ); // If there isnt such user in the database, we send a message in general.

    const rank = new canvacord.Rank() // Build the Rank Card
      .setAvatar(
        target.user.displayAvatarURL({
          format: "png",
          size: 512,
          dynamic: true,
        })
      )
      .setCurrentXP(user.xp) // Current User Xp
      .setRequiredXP(reqXp) // We calculate the required Xp for the next level
      .setRank(user.position) // Position of the user on the leaderboard
      .setLevel(user.level || 0) // Current Level of the user
      .setProgressBar("#FFFFFF", "COLOR")
      .setStatus("dnd")
      .setUsername(target.user.username)
      .setDiscriminator(target.user.discriminator);

    rank.build().then((data) => {
      const attachment = new MessageAttachment(data, "RankCard.png");
      interaction.followUp({ files: [attachment] });
    });
    // interaction.followUp(
    //   `> **${target.tag}** is currently level ${user.level}.`
    // ); // We show the level.
  },
};
