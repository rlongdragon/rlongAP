# 阿龍助教
南崁高中APCS班discord群的輔助機器人，與 Gemini串聯打造智慧社群。


目前功能
- 在頻道內 tag 機器人開啟新對話
- 回復機器人的訊息(要開tag)可接續對話
- 可對任意訊息使用discord訊息右鍵選單，選擇"詢問阿龍助教"即可針對訊息提問
- 討論串輔助功能：版主可以使用discord訊息右鍵選單釘選、解釘、刪除訊息。
- 設定規格暱稱並給予學員身分組

正在進行
- LLM生成APCS觀念題
- ZeroJudge題目爬蟲輔助解題
- 在包含code block的訊息下新增AI輔助表情符號回應，點擊可以執行對應指令


# 安裝
需求
- node.js
- mongoDB

clone這個專案

```bash
git clone https://github.com/rlongdragon/rlongAP.git
cd rlongAP
npm install
```
你可以用[pm2](https://pm2.keymetrics.io/)佈署你的專案
你需要配置你的.env檔案在專案目錄
```env
BOT_TOKEN=""
BOT_CLIENT_ID=""
BOT_GUILD_ID=""
DB_HOST=""
GEMINI_API_KEY=""
ZEROJUDGE_SCHOOL_D=""
ZEROJUDGE_STUDENT_NAME_LISt=[""]
```
```bash
pm2 start ./src/main.js
```








