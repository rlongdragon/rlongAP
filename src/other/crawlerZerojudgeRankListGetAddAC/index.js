const { Client } = require('discord.js')
const getAddACFromZerojudge = require('./getAddACFromZerojudge')

function setWeekWork(clock, week, Client, callback) {
  const targetHour = clock;
  const targetDayOfWeek = week;

  const scheduleNextRun = () => {
    const now = new Date();
    let targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), targetHour, 0, 0);

    if (now.getDay() > targetDayOfWeek || (now.getDay() === targetDayOfWeek && now.getHours() >= targetHour)) {
      targetDate.setDate(targetDate.getDate() + 7 - now.getDay() + targetDayOfWeek);
    } else if (now.getDay() < targetDayOfWeek) {
      targetDate.setDate(targetDate.getDate() + targetDayOfWeek - now.getDay());
    }

    const delay = targetDate.getTime() - now.getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    if (delay > oneDay) {
      setTimeout(() => {
        scheduleNextRun();
      }, oneDay);
    } else {
      setTimeout(() => {
        callback(Client);
        scheduleNextRun();
      }, delay);
    }
  };

  scheduleNextRun();
}

/**
 * 
 * @param { Client } client 
 */
module.exports = async function (client) {
  setWeekWork(23, 7, client,
    /**
     * @param {Client} client
    */
    async (client) => {
      const addAC = await getAddACFromZerojudge()
      // post announcement 
      let embed = {
        "type": "rich",
        "title": `本周解題數統計`,
        "description": "",
        "color": 0x21b14c,
        "fields": []
      }
      for (let i = 0; i < addAC.length; i++) {
        embed.fields.push({
          "name": addAC[i].name,
          "value": `AC: ${addAC[i].AC}, 新增: ${addAC[i].change}`
        })
      }

      const channel = await client.channels.fetch(process.env.BOT_ANNOUNCEMENT_CHANNEL_ID)
      channel.send({ embeds: [embed] })
    }
  )
}
