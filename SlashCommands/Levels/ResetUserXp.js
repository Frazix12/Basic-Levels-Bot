const { Client, CommandInteraction } = require("discord.js");
const Levels = require("discord-xp");
module.exports = {
  name: "resetuserxp",
  description: "Reset a users xp",
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
    try {
      Levels.deleteUser(target.id, interaction.guild.id);
      interaction.followUp(`${target.tag}'s XP Has Been Sucsessfully Removed!`);
    } catch (error) {
      console.log(error);
      interaction.followUp("There has been an erroe");
    }
  },
};
