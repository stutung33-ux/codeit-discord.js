require("dotenv").config();
const discord = require("discord.js");
const fs = require("fs");
const path = require("path");

const { BOT_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!BOT_TOKEN || !CLIENT_ID) {
  console.error('[Deploy] ❌  BOT_TOKEN and CLIENT_ID must be set in your .env file.');
  process.exit(1);
}

const args  = process.argv.slice(2);
const scope = args.includes('--global') ? 'global' : 'guild';

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files   = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkDir(fullPath));
    else if (entry.isFile() && entry.name.endsWith('.js')) files.push(fullPath);
  }
  return files;
}

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = walkDir(commandsPath);
const commands = [];

for (const filePath of commandFiles) {
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.warn(`[Deploy] ⚠️  Skipped ${filePath} — missing "data" or "execute".`);
  }
}

const rest = new discord.REST().setToken(BOT_TOKEN);

(async () => {
  try {
    console.log(`[Deploy] 🚀  Deploying ${commands.length} command(s) ${scope === 'guild' ? `to guild ${GUILD_ID}` : 'globally'}…`);

    const route =
      scope === 'guild'
        ? discord.Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID)
        : discord.Routes.applicationCommands(CLIENT_ID);

    const data = await rest.put(route, { body: commands });

    console.log(`[Deploy] ✅  Successfully deployed ${data.length} command(s).`);
  } catch (error) {
    console.error('[Deploy] ❌  Deployment failed:', error);
    process.exit(1);
  }
})();