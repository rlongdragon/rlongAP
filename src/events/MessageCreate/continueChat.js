const { getChatHistoryDataByMessageId, getChatHistoryByChatHistoryData, updateChatHistory } = require('../../module/chatHistory.js');
const ask = require('../../module/askToGemini.js');

/**
 * @param {import('discord.js').Message} message
 */
module.exports = async (message) => {
  const ref = await message.fetchReference();
  if (!ref.author.id === process.env.BOT_CLIENT_ID) return;
  message.channel.sendTyping();
  const chatHistoryData = await getChatHistoryDataByMessageId(ref.id);
  if (!chatHistoryData) {
    message.reply("找不到對應的對話紀錄，可能已經過期了或是發生錯誤。");
    return;
  }

  const reference = (() => {
    for (let i = 1; i < chatHistoryData.info.historyLength / 2; i++) {
      if (chatHistoryData.history[2 * i + 1].messageId === ref.id) {
        return chatHistoryData.history[2 * i + 1].data[0].parts[0].text;
      }
    }
  })();
  const chatHistory = getChatHistoryByChatHistoryData(chatHistoryData);
  const prompt = `[${message.member.nickname}] 回覆了你的這段話:\n${reference}\n\n[${message.member.nickname}]: ${message.content}`;

  const response = await ask(chatHistory, prompt);

  // replay.edit(response);
  const replay = await message.reply(response, { allowedMentions: { repliedUser: false } });

  if (updateChatHistory(chatHistoryData._id, replay.id, prompt, response, message.author.id)) {
    console.log("Error in updateChatHistory");
  }
}