const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('釘選訊息')
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
    if (interaction.targetMessage.pinned) {
      await interaction.reply({ content: "已經是釘選訊息", ephemeral: true });
      return;
    } 
    await interaction.targetMessage.pin()
    await interaction.reply({ content: `<@${user}> 釘選了訊息 ${interaction.targetMessage.url}`});
  },
}

