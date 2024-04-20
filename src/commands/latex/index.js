const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("latex")
        .setDescription("傳送數學公式")
        .addStringOption(option =>
            option.setName('formula')
                .setDescription("輸入數學公式")
                .setRequired(true))
        .addStringOption(option =>
            option.setName('bgcolor')
                .setDescription("背景填滿")
                .addChoices(
                    {name:"透明", value:"bg,s,00000000"},
                    {name:"白色", value:"bg,s,ffffff"},
                    {name:"黑色", value:"bg,s,000000"}
                )
                .setRequired(false))
        .addStringOption(option =>
            option.setName('color')
                .setDescription("文字顏色")
                .addChoices(
                    {name:"白色", value:"ffffff"},
                    {name:"黑色", value:"000000"},
                    {name:"藍色", value:"0000ff"},
                    {name:"綠色", value:"00ff00"},
                    {name:"紅色", value:"ff0000"},
                    {name:"黃色", value:"ffff00"},
                )
                .setRequired(false))
        .addStringOption(option =>
            option.setName('size')
                .setDescription("圖片大小")
                .addChoices(
                    {name:"極小", value:"20"},
                    {name:"小", value:"30"},
                    {name:"中", value:"40"},
                    {name:"大", value:"50"},
                    {name:"特大", value:"100"},
                )
                .setRequired(false)),
    async execute(interaction) {
        interaction.reply("google API 已經停止服務，靜待更新功能。");
        return;

        const formula = interaction.options.getString("formula");
        const bgcolor = interaction.options.getString("bgcolor");
        const color = interaction.options.getString("color");
        const size = interaction.options.getString("size");

        let lastOutput = "https://chart.apis.google.com/chart?cht=tx";
        // https://chart.apis.google.com/chart?cht=tx&chs=50&chco=FFFF00&chf=bg,s,FFFF0000&chl=E%20=%20mc^2
        // replace formula cha to url code
        let formulaCode = encodeURIComponent(formula);

        // add formula to url
        lastOutput += `&chl=${formulaCode}`;

        // add bgcolor to url
        // default: transparent
        if (bgcolor != null) {
            lastOutput += `&chf=${bgcolor}`;
        } else {
            lastOutput += `&chf=bg,s,00000000`;
        }

        // add color to url
        // default: white
        if (color != null) {
            lastOutput += `&chco=${color}`;
        } else {
            lastOutput += `&chco=ffffff`;
        }

        // add size to url
        // default: 30
        if (size != null) {
            lastOutput += `&chs=${size}`;
        } else {
            lastOutput += `&chs=30`;
        }

        // send image
        // await interaction.reply({ files: [lastOutput] });
        console.log(lastOutput);
        await interaction.reply({ content: lastOutput });
    },
};
