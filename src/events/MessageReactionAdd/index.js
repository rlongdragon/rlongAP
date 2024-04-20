const { Events } = require('discord.js');
const { getEmojiEventDataByMessageId } = require('../../module/emojiEventData.js');
const addRole = require('./addRoles.js');

module.exports = {
  name: Events.MessageReactionAdd,
  /**
   * @param {import('discord.js').MessageReaction} message
   */
  async execute(message) {
    return;
    const messageId = message.message.id;
    for (const role of addRole) {
      if (role.messageId === messageId) {
        role.execute(message);
        return;
      }
    }

    const emojiEventData = await getEmojiEventDataByMessageId(messageId);
    if (!emojiEventData) return;
    switch (emojiEventData.type) {
      case "AIoption":
        if (message.emoji.name === "✅") {}
        break;
      default:
        break;
    }
  },
};