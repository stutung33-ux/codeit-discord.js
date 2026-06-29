const discord = require("discord.js");

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client){
        if (interaction.isAutocomplete()) {
            const command = client.commands.get(interaction.commandName);

            if (!command?.autocomplete) return;

            try {
                await command.autocomplete(interaction, client);
            } catch(error) {
                console.error(`[InteractionCreate] ❌  Error executing autocomplete for command: ${interaction.commandName}`);
            }

            return;
        }

        if (interaction.isModalSubmit()) {
            if (interaction.customId === "staff_application") {
                const name = interaction.fields.getTextInputValue('name_input');
                const reason = interaction.fields.getTextInputValue('app_reason');

                await interaction.reply({
                    content: `✅ Application submitted!\n\n**Name:** ${name}\n**Reason:** ${reason}`,
                    ephemeral: true,
                });

                console.log(`New Application Submitted!\nName: ${name}\nReason: ${reason}`);
            }

            return;
        }

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
            console.error(`[InteractionCreate] ❌  Error executing command: ${interaction.commandName}\n\n${error}`);

            const payload = {
                content: '⚠️ There was an error while executing this command!',
                ephemeral: true,
            };

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(payload);
            } else if (interaction.isRepliable()) {
                await interaction.reply(payload);
            }
        }
    }
}