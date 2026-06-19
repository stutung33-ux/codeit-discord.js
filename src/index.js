require("dotenv").config();
const discord = require("discord.js");
const {intents} = require("./config.js");
const loadCommands = require('./handlers/commandHandler.js');
const loadEvents   = require('./handlers/eventHandler.js');

const client = new discord.Client({intents});

client.commands = new discord.Collection();

loadCommands(client);
loadEvents(client);

client.login(process.env.BOT_TOKEN);