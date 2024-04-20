const { SlashCommandBuilder } = require("discord.js");
const ask  = require("../../module/askToGemini.js");
const { insertNewChat } = require("../../module/chatHistory.js");
const prePrompt = require("../../pre-prompt/general.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("詢問名詞")
    .setDescription("尋問名詞相關的意思")
    .addStringOption(option =>
      option.setName("value")
        .setDescription("請輸入你想詢問的名詞")
        .setRequired(true)
    ),

  /**
   * @param {import("discord.js").CommandInteraction} interaction 
   */
  async execute(interaction) {
    rep = await interaction.deferReply();

    const ModelPrompt = `[${interaction.member.nickname}]: 助教，什麼是${interaction.options.getString("value")}`;
    const ChatHistory = [{
      role: "user",
      parts: [{ text: prePrompt[0] }]
    },
    {
      role: "model",
      parts: [{ text: prePrompt[1] }]
    },]
    console.log(ModelPrompt);
    const ModelResponse = await ask(ChatHistory, ModelPrompt);
    interaction.editReply(ModelResponse);

    // console.log((await interaction.fetchReply()).id);

    // console.log();

    if ( insertNewChat(
      ChatHistory[0].parts[0].text,
      ChatHistory[1].parts[0].text,
      ModelPrompt,
      ModelResponse,
      (await interaction.fetchReply()).id,
      interaction.member.user.id
    ) ) console.log("Error in insertNewChat");
  },
};