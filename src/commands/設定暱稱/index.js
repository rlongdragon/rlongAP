const { SlashCommandBuilder } = require("discord.js");
const ask  = require("../../module/askToGemini.js");
const { insertNewChat } = require("../../module/chatHistory.js");
const prePrompt = require("../../pre-prompt/general.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("設定暱稱")
    .setDescription("填入基本資料，更改為制式暱稱")
    .addStringOption(option =>
      option.setName("class")
        .setDescription("班級座號(30425)")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("name")
        .setDescription("你的姓名(鍾佳龍)")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("nickname")
        .setDescription("暱稱")
    ),

  /**
   * @param {import("discord.js").CommandInteraction} interaction 
   */
  async execute(interaction) {
    // 304鍾佳龍 [阿龍]
    const classNumber = interaction.options.getString("class");
    const name = interaction.options.getString("name");
    const nickname = interaction.options.getString("nickname");
    const member = interaction.member;
    const guild = interaction.guild;
    let memberNickname = `${classNumber}${name}`;
    if (nickname) memberNickname += ` [${nickname}]`;

    // Set nickname
    await member.setNickname(memberNickname)
    await interaction.reply(`暱稱已設定為 ${memberNickname}`);

    // Set role
    // const role1 = guild.roles.cache.find(role => role.name === "認證");
    const role = guild.roles.cache.find(role => role.name === "2024學員");
    // await member.roles.add(role1);
    await member.roles.add(role);

    
  },
};