const discord = require("discord.js");

module.exports = {
    data: new discord.SlashCommandBuilder()
    .setName("echo")
    .setDescription("Repeats your message back to you")
    .addStringOption(option =>
        option.setName("message")
        .setDescription("The text you want the bot to repeat")
        .setRequired(true)
    ),

    async execute(interaction, client) {
        const inputMessage = interaction.options.getString('message');

        await interaction.reply({
            content: inputMessage,
        });
    }
}