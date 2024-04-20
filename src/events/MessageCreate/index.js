require('dotenv').config();
const { Events } = require('discord.js');
const continueChat = require('./continueChat.js');
const startNewChat = require('./startNewChat.js');
const aiOption = require('./aiOption.js');

module.exports = {
  name: Events.MessageCreate,
  /**
   * @param {import('discord.js').Message} message
   */
  async execute(message) {
    if (message.mentions.has(process.env.BOT_CLIENT_ID)) {
      if (message.reference) {
        continueChat(message);
      }
      else {
        startNewChat(message);
      }
    } else {
      aiOption(message);
    }
  },
};