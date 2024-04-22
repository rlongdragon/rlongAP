require('dotenv').config();
const mongoose = require('mongoose');
const MONGODB_URI = process.env.DB_HOST;
const DB = "rlongBotAP";
const COLLECTION = "ZJACHistory";
const { load } = require('cheerio')


async function getACFromZerojudge() {
  let nameList = JSON.parse(process.env.ZEROJUDGE_STUDENT_NAME_LIST)
  let data = []

  for (let p = 1; p <= 3; p++) {
    const res = await fetch(`https://zerojudge.tw/Ranking?page=${p}&&schoolid=${process.env.ZEROJUDGE_SCHOOL_ID}&tab=tab03`)
    const text = await res.text()
    const $ = load(text)
    let sessionFind = []
    for (let i = 0; i < nameList.length; i++) {
      let lname = nameList[i]
      const nameElement = $(`a[href="Submissions?account=${lname}&status=AC"]`)
      if (nameElement.length === 0) {
        continue
      }
      data.push({ "name": lname, "AC": nameElement.text() })
      sessionFind.push(lname)
    }
    for (let i = 0; i < sessionFind.length; i++) {
      nameList.splice(nameList.indexOf(sessionFind[i]), 1)
    }
  }
  for (let i = 0; i < nameList.length; i++) {
    data.push({ "name": nameList[i], "AC": "0" })
  }
  return data
}

module.exports = async () => {
  await mongoose.connect(`mongodb://${MONGODB_URI}/${DB}`);
  let lastData = await mongoose.connection.db.collection(COLLECTION).findOne({}, { sort: { createTimeStamp: -1 } });
  if (!lastData) {
    console.error("DATA ERROR: No last data")
  }

  let data = await getACFromZerojudge()

  let insertData = {
    "info": {
      "createTimeStamp": Date.now(),
    },
    "data": data
  }
  mongoose.connection.db.collection(COLLECTION).insertOne(insertData, function (err, res) {
    if (err) {
      console.log(`Error: ${err}`);
      return 1 // error
    }
    console.log("1 document inserted");
    mongoose.connection.close();
  });
  
  // Compare data
  let compareData = []
  for(let i = 0; i < data.length; i++) {
    let name = data[i].name
    let AC = data[i].AC
    let lastDataFind = lastData.data.find((e) => e.name === name)
    if (!lastDataFind) {
      compareData.push({ "name": name, "AC": AC, "change": AC })
    } else {
      compareData.push({ "name": name, "AC": AC, "change": AC - lastDataFind.AC })
    }
  }

  return compareData
}
