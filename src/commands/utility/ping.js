const discord = require("discord.js");

module.exports = {
    data: new discord.SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with the bot's latency."),

    async execute(interaction) {
        const sent = await interaction.reply({ content: "Pinging...", fetchReply: true });

        const roundTrip = sent.createdTimestamp - interaction.createdTimestamp;
        const wsLatency = interaction.client.ws.ping;

        const pingEmbed = new discord.EmbedBuilder()
        .setColor("Blurple")
        .setTitle("🏓 Pong!")
        .addFields(
            { name: '📡 Roundtrip Latency', value: `\`${roundTrip}ms\``, inline: true },
            { name: '💓 WebSocket Heartbeat', value: `\`${wsLatency}ms\``, inline: true }
        )
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();

        await interaction.editReply({ content: " ", embeds: [pingEmbed] });
    }
}