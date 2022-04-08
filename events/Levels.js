const Levels = require("discord-xp");
const canvacord = require("canvacord");
const client = require("../index");
const { mongooseConnectionString } = require("../config.json");
const { MessageAttachment } = require("discord.js");
Levels.setURL(mongooseConnectionString);

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;
  const randomAmountOfXp = Math.floor(Math.random() * 99) + 1; // Min 1, Max 30
  const hasLeveledUp = await Levels.appendXp(
    message.author.id,
    message.guild.id,
    randomAmountOfXp
  );
  if (hasLeveledUp) {
    const user = await Levels.fetch(message.author.id, message.guild.id, true);
    let reqXp = Levels.xpFor(parseInt(user.level) + 1);
    const rank = new canvacord.Rank() // Build the Rank Card
      .setAvatar(
        message.author.displayAvatarURL({
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
      .setUsername(message.author.username)
      .setDiscriminator(message.author.discriminator);
    rank.build().then((data) => {
      const attachment = new MessageAttachment(data, "RankCard.png");
      message.channel.send({
        content: `${message.author}, congratulations! You have leveled up to **${user.level}**. :tada:`,
        files: [attachment],
      });
    });
  }
});
