require('dotenv').config();
const mongoose = require('mongoose');
const MONGODB_URI = process.env.DB_HOST;
const DB = "rlongBotAP";
const COLLECTION = "chatHistory";
/**
 * @param {string} prePrompt
 * @param {string} preReplay
 * @param {string} prompt
 * @param {string} replay
 * @param {string} botReplayMessageId
 * @param {string} firstChatMember
 * @returns {number} 0 for success, 1 for error
 */
async function insertNewChat(prePrompt, preReplay, prompt, replay, botReplayMessageId, firstChatMember) {
  // connect to the database
  await mongoose.connect(`mongodb://${MONGODB_URI}/${DB}`);
  // create a schema
  let data = {
    botReplayMessageIds: [botReplayMessageId],
    info: {
      createTimeStamp: Date.now(),
      firstChatMember: firstChatMember,
      chatMembers: [firstChatMember],
      historyLength: 4,
    },
    history: [
      {
        type: "pre-prompt",
        data: [{ role: "user", parts: [{ text: prePrompt }] }]
      }, {
        type: "pre-replay",
        data: [{ role: "model", parts: [{ text: preReplay }] }]
      }, {
        type: "prompt",
        data: [{ role: "user", parts: [{ text: prompt }] }]
      }, {
        type: "replay",
        messageId: botReplayMessageId,
        data: [{ role: "model", parts: [{ text: replay }] }]
      }
    ]
  }
  // insert the data
  mongoose.connection.db.collection(COLLECTION).insertOne(data, function (err, res) {
    if (err) {
      console.log(`Error: ${err}`);
      return 1 // error
    }
    console.log("1 document inserted");
    // close the connection
    mongoose.connection.close();
  });
  return 0; // success
}


/**
 * @param {string} chatObjectId
 * @param {string} messageId
 * @param {string} user
 * @param {string} model
 * @param {string} user_id
 * @returns {number} 0 for success, 1 for error
 */
async function updateChatHistory(chatObjectId, messageId, user, model, user_id) {
  // connect to the database
  await mongoose.connect(`mongodb://${MONGODB_URI}/${DB}`);
  // create a schema
  let data = {
    $push: {
      botReplayMessageIds: messageId,
      chatMembers: user_id,
      history: [{
        type: "prompt",
        data: {
          role: "user",
          parts: [{ text: user }]
        }
      }, {
        type: "replay",
        messageId: messageId,
        data: {
          role: "model",
          parts: [{ text: model }]
        }
      }]
    }
  }
  // insert the data
  mongoose.connection.db.collection(COLLECTION).updateOne({ _id: chatObjectId }, data, function (err, res) {
    if (err) {
      console.log(`Error: ${err}`);
      return 1 // error
    }
    console.log("1 document updated");
    // close the connection
    mongoose.connection.close();
  });
}

/**
 * @param {string} messageId
 * @returns {string} chatObjectId
 */
async function getChatHistoryIdByMessageId(messageId) {
  // connect to the database
  await mongoose.connect(`mongodb://${MONGODB_URI}/${DB}`);
  // create a schema
  let data = {
    botReplayMessageIds: messageId
  }
  // insert the data
  mongoose.connection.db.collection(COLLECTION).findOne(data, function (err, res) {
    if (err) {
      console.log(`Error: ${err}`);
      return 1 // error
    }
    console.log(res);
    // close the connection
    mongoose.connection.close();
    return res._id;
  });
}

/**
 * @param {string} messageId
 * @returns {{
 *  botReplayMessageIds: number[],
 *  info: {
 *    createTimeStamp: number,
 *    firstChatMember: string,
 *    chatMembers: string[],
 *    historyLength: number
 *  },
 *  history: {
 *    type: string,
 *    data: {
 *      role: string,
 *      messageId: string,
 *      parts: [{ text: string }]
 *    }[]
 *  }[]
 * }} chatHistoryData
 */
async function getChatHistoryDataByMessageId(messageId) {
  // connect to the database
  await mongoose.connect(`mongodb://${MONGODB_URI}/${DB}`);
  // create a schema
  let data = {
    botReplayMessageIds: messageId
  }
  // insert the data
  const chatData = await mongoose.connection.db.collection(COLLECTION).findOne(data)
  if (chatData) {
    // close the connection
    mongoose.connection.close();
    return chatData;
  }
  else
    return 0
}

function getChatHistoryByChatHistoryData(chatHistoryData) {
  let chatHistory = []
  for (let i = 0; i < chatHistoryData.info.historyLength; i++) {
    chatHistory.push(chatHistoryData.history[i].data[0])
  }
  return chatHistory
}

module.exports = {
  insertNewChat,
  updateChatHistory,
  getChatHistoryIdByMessageId,
  getChatHistoryDataByMessageId,
  getChatHistoryByChatHistoryData
}