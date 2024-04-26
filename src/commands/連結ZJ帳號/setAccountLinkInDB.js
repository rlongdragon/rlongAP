const mongoose = require('mongoose')
const MONGODB_URI = process.env.DB_HOST
const DB = "rlongBotAP"
const COLLECTION = "ZJACHistory"

/**
 * @param {{"discordMemberId": string, "zerojudgeUserId": string}} data 
 */
module.exports = async (data) => {
  // Connect to DB
  await mongoose.connect(`mongodb://${MONGODB_URI}/${DB}`)
  // update data
  /**
   * {
   *  "dataType": "accountLink",
   *  data: [
   *  {
   *   "discordMemberId": "123456789",
   *  "zerojudgeUserId": "rlong"
   *  }]
   * }
   */
  // db.test.updateOne({ name: "insertTest" }, { $set: { "data.$[element].value": "updatedData" } }, { arrayFilters: [{ "element.name": "2" }] }). modifiedCount
  dbOperateReturn = await mongoose.connection.db.collection(COLLECTION).updateOne(
    { "dataType": "accountLink" },
    { $set: { "data.$[element].zerojudgeUserId": data.zerojudgeUserId } },
    { arrayFilters: [{ "element.discordMemberId": data.discordMemberId }] }
  ).modifiedCount

  if (!dbOperateReturn) {
    // Insert new data
    dbOperateReturn = await mongoose.connection.db.collection(COLLECTION).updateOne(
      { 'dataType': 'accountLink' },
      { $push: { data: data } }
    )
  }
}