const { SlashCommandBuilder } = require("discord.js");
const getUserNameByUserIdFromZJ = require("./getUserNameByUserIdFromZJ");
const setAccountLinkInDB = require("./setAccountLinkInDB");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("連結zj帳號")
    .setDescription("將discord帳號連結到Zerojudge帳號")
    .addStringOption(option =>
      option.setName("user_id")
        .setDescription("Zerojudge帳號個人基本訊息中的編號")  
        .setRequired(true)
    ),

  /**
   * @param {import("discord.js").CommandInteraction} interaction 
   */
  async execute(interaction) {
    const userID = interaction.options.getString("user_id");
    // 正則表達式，確認是不是全由數字組成
    const regex = /^[0-9]*$/;
    if (!regex.test(userID)) {
      await interaction.reply("請輸入正確的Zerojudge帳號編號");
      return;
    }
    const userName = await getUserNameByUserIdFromZJ(userID);
    if (!userName) {
      await interaction.reply("找不到該帳號");
      return;
    }
    act = await setAccountLinkInDB({
      discordMemberId: interaction.member.id,
      zerojudgeUserId: userName,
    });
    if (act == 1) {
      await interaction.reply("重複連結");
      return;
    } else if (act == 2) {
      await interaction.reply(`新的連結: ${userName}`);
      return;
    }
    await interaction.reply(`連結成功: ${userName}`);
  },
};