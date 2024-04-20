const { SlashCommandBuilder } = require("discord.js");
const ask = require("../../module/askToGemini.js");
const { getChatHistoryDataByMessageId, getChatHistoryByChatHistoryData, updateChatHistory } = require("../../module/chatHistory.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("繼續對話")
    .setDescription("回覆助教的對話")
    .addStringOption(option =>
      option.setName("message_id")
        .setDescription("請輸入助教的對話的訊息ID或連結")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("value")
        .setDescription("你想說的話")
        .setRequired(true)
    ),

  /**
   * @param {import("discord.js").CommandInteraction} interaction 
   */
  async execute(interaction) {
    rep = await interaction.deferReply();
    let messageID = (await interaction.options.getString("message_id")).split("/").pop();

    const chatHistoryData = await getChatHistoryDataByMessageId(messageID);
    if (!chatHistoryData) {
      interaction.editReply("找不到對應的對話紀錄，可能已經過期了或是發生錯誤。");
      return;
    }

    const reference = (() => {
      for (let i = 1; i < chatHistoryData.info.historyLength / 2; i++) {
        if (chatHistoryData.history[2 * i + 1].messageId === messageID) {
          return chatHistoryData.history[2 * i + 1].data[0].parts[0].text;
        }
      }
    })();
    const chatHistory = getChatHistoryByChatHistoryData(chatHistoryData);
    const prompt = `[${interaction.member.nickname}] 回覆了你的這段話:\n${reference}\n\n[${interaction.member.nickname}]: ${await interaction.options.getString("value")}`;

    const response = await ask(chatHistory, prompt);

    await interaction.editReply(response);

    if (updateChatHistory(chatHistoryData._id, (await interaction.fetchReply()).id, prompt, response, interaction.member.user.id)) {
      console.log("Error in updateChatHistory");
    }
  },
};