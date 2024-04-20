const { load } = require('cheerio')

const nameList = process.env.ZEROJUDGE_NAME_LIST.split(',')

let datas = []

async function main() {
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
      datas.push({ "name": lname, "AC": nameElement.text() })
      sessionFind.push(lname)
    }
    for (let i=0; i<sessionFind.length; i++) {
      nameList.splice(nameList.indexOf(sessionFind[i]), 1)
    }
  }
  for (let i = 0; i < nameList.length; i++) {
    datas.push({ "name": nameList[i], "AC": "0" })
  }
  console.log(datas)
}

main()