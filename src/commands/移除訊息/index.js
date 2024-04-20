const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const removeMessageWait = 3600 // (s)


module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('移除訊息')
    .setType(ApplicationCommandType.Message),
  async execute(interaction) {
    let user = interaction.user.id;
    let channelOwner = interaction.channel.ownerId;
    if (interaction.channel.type != 11) {
      await interaction.reply({ content: "此頻道不支援此功能", ephemeral: true });
      return;
    }
    if (user != channelOwner) {
      await interaction.reply({ content: "你不是`原PO`", ephemeral: true });
      return;
    } 
    let replyMessage = await interaction.reply({ content: `<@${user}> 移除了訊息 ${interaction.targetMessage.url}\n訊息將在<t:${Math.floor(Date.now() / 1000) + removeMessageWait}:R> 移除訊息`});
    setTimeout(async () => {
      await interaction.targetMessage.delete();
      await replyMessage.edit({ content: `<@${user}> 移除了一條訊息`})
    }, removeMessageWait * 1000);
  },
}

