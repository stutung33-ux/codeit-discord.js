const discord = require("discord.js")

module.exports = {
    data: new discord.SlashCommandBuilder()
    .setName("profile")
    .setDescription("View your profile"),

    async execute(interaction, client){
        const headerText = new discord.TextDisplayBuilder()
        .setContent("**Welcome to your profile!**")

        const divider = new discord.SeparatorBuilder()
        .setDivider(true)
        .setSpacing(discord.SeparatorSpacingSize.Small)

        const avatarThumbnail = new discord.ThumbnailBuilder({ 
            media: { url: interaction.user.displayAvatarURL({ extension: 'png' }) } 
        });

        const userSection = new discord.SectionBuilder()
            .addTextDisplayComponents(
                new discord.TextDisplayBuilder().setContent(`**${interaction.user.username}'s Profile**`),
                new discord.TextDisplayBuilder().setContent('This is a natively structured section description block. Notice how perfectly aligned this text looks next to the image.')
            )
            .setThumbnailAccessory(avatarThumbnail);

        const layoutContainer = new discord.ContainerBuilder()
        .addTextDisplayComponents(headerText)
        .addSeparatorComponents(divider)
        .addSectionComponents(userSection);

        await interaction.reply({
            components: [layoutContainer],
            flags: discord.MessageFlags.IsComponentsV2
        })
    }
}