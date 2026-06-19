const discord = require("discord.js");

module.exports = {
    data: new discord.SlashCommandBuilder()
    .setName("feedback")
    .setDescription("Rate your experience with the bot and provide feedback!"),

    async execute(interaction, client){
        const primaryButton = new discord.ButtonBuilder()
        .setCustomId("good_feedback")
        .setLabel("Good")
        .setStyle(discord.ButtonStyle.Success)

        const dangerButton = new discord.ButtonBuilder()
        .setCustomId("bad_feedback")
        .setLabel("Bad")
        .setStyle(discord.ButtonStyle.Danger);

        const row = new discord.ActionRowBuilder()
        .addComponents(primaryButton, dangerButton);

        const response = await interaction.reply({
            content: "How has your experience been with the bot?",
            components: [row],
            fetchReply: true,
        });

        const collector = response.createMessageComponentCollector({ time: 30000 });

        collector.on("collect", async(i) =>{
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: 'This feedback menu isn\'t for you!', ephemeral: true });
            }

            if (i.customId === 'good_feedback') {
                await i.update({ content: 'Thank you! We are glad you love the bot! 🎉', components: [] });
            } else if (i.customId === 'bad_feedback') {
                await i.update({ content: 'Sorry to hear that. We will work hard to improve! 🛠️', components: [] });
            }
        })

        collector.on("end", async() =>{
            const disabledRow = new discord.ActionRowBuilder()
            .addComponents(
                discord.ButtonBuilder.from(primaryButton).setDisabled(true),
                discord.ButtonBuilder.from(dangerButton).setDisabled(true)
            );

            await interaction.editReply({ components: [disabledRow] });
        })
    }
}