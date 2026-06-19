const discord = require("discord.js");

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client){
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

         if (!command) {
            console.error(`[InteractionCreate] ❌  Unknown command: ${interaction.commandName}`);
            await interaction.reply({
                content: '⚠️ Unknown command. It may have been removed.',
                ephemeral: true,
            });
            return;
        }

        try{
            await command.execute(interaction);
        }catch(error){
            console.error(`[InteractionCreate] ❌  Error executing command: ${interaction.commandName}`);

            await interaction.reply({
                content: '⚠️ There was an error while executing this command!',
            })
        }
    }
}