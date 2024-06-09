const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const ask  = require("../../module/askToGemini.js");
const { insertNewChat } = require("../../module/chatHistory.js");
const prePrompt = require("../../pre-prompt/general.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('詢問阿龍助教')
    .setType(ApplicationCommandType.Message),
  /**
   * @param {import("discord.js").MessageContextMenuCommandInteraction} interaction 
   */
  async execute(interaction) {
    // typing
    let r = interaction.deferReply();
    const content = interaction.targetMessage.content
    const ModelPrompt = `[${interaction.member.nickname}]: 助教，我想問這則訊息：\n${content}\n\n<學生提出問題，你可以問他需要甚麼幫助>`.replace("<@1224766213641605131>", "");
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
    console.log(ModelResponse);
    // interaction.reply(ModelResponse);
    await interaction.editReply(ModelResponse);

    // console.log((await interaction.fetchReply()).id);

    // console.log();

    if ( insertNewChat(
      ChatHistory[0].parts[0].text,
      ChatHistory[1].parts[0].text,
      ModelPrompt,
      ModelResponse,
      (await interaction.fetchReply()).id,
      interaction.user.id
    ) ) console.log("Error in insertNewChat");


  },
}

