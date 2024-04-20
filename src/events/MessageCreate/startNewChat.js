const { insertNewChat } = require('../../module/chatHistory.js');
const ask = require('../../module/askToGemini.js');
const prePrompt = require('../../pre-prompt/general.js');

/**
 * @param {import('discord.js').Message} message
 */
module.exports = async (message) => {
  message.channel.sendTyping();
  const ModelPrompt = `[${message.member.nickname}]: 助教，${message.content}`.replace(`<@${process.env.BOT_CLIENT_ID}>`, "");
  const ChatHistory = [{
    role: "user",
    parts: [{ text: prePrompt[0] }]
  },
  {
    role: "model",
    parts: [{ text: prePrompt[1] }]
  },]
  const ModelResponse = (await ask(ChatHistory, ModelPrompt)).replace(`<@${process.env.BOT_CLIENT_ID}>`, "");

  const replay = await message.reply(ModelResponse, { allowedMentions: { repliedUser: false } });

  if (insertNewChat(
    ChatHistory[0].parts[0].text,
    ChatHistory[1].parts[0].text,
    ModelPrompt,
    ModelResponse,
    replay.id,
    message.author.id
  )) console.log("Error in insertNewChat");
}