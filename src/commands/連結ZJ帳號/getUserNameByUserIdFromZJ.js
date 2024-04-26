const { load } = require('cheerio')

module.exports = async (userID) => {
  for (let p = 1; p <= 3; p++) {
    // console.log(p)
    const res = await fetch(`https://zerojudge.tw/Ranking?page=${p}&&schoolid=637&tab=tab03`)
    const text = await res.text()
    const $ = load(text)
    user = $(`a[href="./UserStatistic?id=${userID}"]`)[0]
    if (user == null) {
      continue
    }
    return user.attribs.title
  }
}
