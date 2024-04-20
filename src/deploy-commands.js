require("dotenv").config();
const { REST, Routes } = require('discord.js'); // 載入 discord.js REST 模組
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath, { withFileTypes: true })
    .filter(file => file.isDirectory());

for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder.name);
    const indexFilePath = path.join(folderPath, 'index.js');

    if (fs.existsSync(indexFilePath)) { // 確認 index.js 存在
        console.log(`[INFO] Loading command /${folder.name}`)
        const command = require(indexFilePath); // 載入 index.js
        if ('data' in command && 'execute' in command) { // 確認 data 與 execute 屬性存在
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${indexFilePath} is missing a required "data" or "execute" property.`); // 載入失敗
        }
    }
}
console.log()


// 創建 REST 物件
const rest = new REST().setToken(process.env.BOT_TOKEN);

// 透過 REST 物件的 put 方法更新指令
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // 透過 REST 物件的 put 方法更新指令
        const data = await rest.put( 
            Routes.applicationCommands(process.env.BOT_CLIENT_ID), // 更新應用程式指令
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);

    } catch (error) {
        // 發生錯誤
        console.error(error);
    }
})();