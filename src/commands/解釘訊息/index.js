const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('解釘訊息')
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
    if (!interaction.targetMessage.pinned) {
      await interaction.reply({ content: "還沒釘選訊息", ephemeral: true });
      return;
    } 
    await interaction.targetMessage.unpin()
    await interaction.reply({ content: `<@${user}> 解釘了訊息 ${interaction.targetMessage.url}`});
  },
}

