const discord = require('discord.js');

module.exports = {
    data: new discord.SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Displays detailed information about a server member")
    .addUserOption(option =>
        option.setName("user")
        .setDescription("The member to get information about")
        .setRequired(false)
    ),

    async execute(interaction, client){
        const user = interaction.options.getUser("user") || interaction.user;

        const member = await interaction.guild.members.fetch(user.id);

        const infoEmbed = new discord.EmbedBuilder()
        .setColor("Blurple")
        .setTitle(`${user.username}'s Account Info`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields(
            { name: 'User Tag', value: `${user.tag}`, inline: true },
            { name: 'Is Bot?', value: `${user.bot ? 'Yes 🤖' : 'No 👤'}`, inline: true },
            { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: false },
            { name: 'Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: false }
        );

        await interaction.reply({ embeds: [infoEmbed] })
    }
}