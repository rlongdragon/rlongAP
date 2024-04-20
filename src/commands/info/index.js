const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("關於機器人"),
  /**
   * @param {import("discord.js").CommandInteraction} interaction 
   */
  async execute(interaction) {

    let embed = {
      "type": "rich",
      "title": `BOT INFO`,
      "description": "",
      "color": 0x21b14c,
      "fields": [{
        "name": `開發者`,
        "value": `<@601819508943880193>`
      }, {
        "name": `使用語言`,
        "value": `node.js`
      },
      ]
    }

    await interaction.reply({ embeds: [embed] });
  },
};