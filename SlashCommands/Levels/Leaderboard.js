const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Levels = require("discord-xp");
module.exports = {
  name: "leaderboard",
  description: "Gives Us the leaderboard for this server",
  type: "CHAT_INPUT",
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    const rawLeaderboard = await Levels.fetchLeaderboard(
      interaction.guild.id,
      10
    );

    if (rawLeaderboard.length < 1) return reply("Nobody's in leaderboard yet.");

    const leaderboard = await Levels.computeLeaderboard(
      client,
      rawLeaderboard,
      true
    ); // We process the leaderboard.

    const lb = leaderboard.map(
      (e) =>
        `**${e.position}**. ***${e.username}#${
          e.discriminator
        }***  ***Level***: **${
          e.level
        }** ***XP:***  **${e.xp.toLocaleString()}**`
    ); // We map the outputs.

    // interaction.followUp(`**Leaderboard**:\n\n${lb.join("\n\n")}`);
    const lbembed = new MessageEmbed()
      .setTitle("**Leaderboard**")
      .setDescription(`\n\n${lb.join("\n\n")}`);
    interaction.followUp({ embeds: [lbembed] });
  },
};
