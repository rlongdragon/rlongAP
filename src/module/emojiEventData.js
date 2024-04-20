require('dotenv').config();
const mongoose = require('mongoose');
const MONGODB_URI = process.env.DB_HOST;
const DB = "rlongBotAP";
const COLLECTION = "emoijEventData";

/**
 * @param {string} messageId 
 * @param {string} memberId 
 */
async function newAiOption(messageId, memberId) {
  await mongoose.connect(`mongodb://${MONGODB_URI}/${DB}`);
  let data = {
    "info": {
      "createTimeStamp": Date.now(),
      "memberId": memberId,
    },
    "messageId": messageId,
    "type": "AIoption"
  }
  mongoose.connection.db.collection(COLLECTION).insertOne(data, function (err, res) {
    if (err) {
      console.log(`Error: ${err}`);
      return 1 // error
    }
    console.log("1 document inserted");
    mongoose.connection.close();
  });
}


/**
 * @param {string} messageId 
 */
async function getEmojiEventDataByMessageId(messageId) {
  await mongoose.connect(`mongodb://${MONGODB_URI}/${DB}`);
  let data = await mongoose.connection.db.collection(COLLECTION).findOne({ messageId: messageId });
  mongoose.connection.close();
  return data;
}

module.exports = {
  newAiOption,
  getEmojiEventDataByMessageId
}