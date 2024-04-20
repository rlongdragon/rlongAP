const { newAiOption } = require('../../module/emojiEventData.js');

/**
 * @param {import('discord.js').Message} message
 */
module.exports = (message) => {
  let content = message.content;
  let spc = content.split("```")
  if (spc.length == 1) return;
  
  newAiOption(message.id, message.author.id);
}
