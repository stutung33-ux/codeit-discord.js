require("dotenv").config();
const discord = require("discord.js");

const client = new discord.Client({
    intents: [
        discord.GatewayIntentBits.Guilds,
        discord.GatewayIntentBits.GuildMessages,
        discord.GatewayIntentBits.MessageContent
    ]
});

client.once("clientReady", () =>{
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", message =>{
    if (message.content === "!ping"){
        message.reply("Pong!");
    } else if(message.content === "!youtube"){
        message.reply("https://www.youtube.com/@codeitofficial3");
    }
})

client.login(process.env.BOT_TOKEN);