const fs   = require('fs');
const path = require('path');

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files   = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDir(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }

  return files;
}

function loadCommands(client) {
  const commandsPath = path.join(__dirname, '..', 'commands');
  const commandFiles = walkDir(commandsPath);

  let loaded = 0;
  let failed = 0;

  for (const filePath of commandFiles) {
    try {
      const command = require(filePath);

      // Validate the exported shape
      if (!('data' in command) || !('execute' in command)) {
        console.warn(
          `[CommandHandler] ⚠️  Skipped ${path.relative(commandsPath, filePath)} — missing "data" or "execute" export.`
        );
        failed++;
        continue;
      }

      client.commands.set(command.data.name, command);
      loaded++;
      console.log(`[CommandHandler] ✅  Loaded command: /${command.data.name}`);
    } catch (error) {
      console.error(`[CommandHandler] ❌  Failed to load ${filePath}:`, error);
      failed++;
    }
  }

  console.log(
    `[CommandHandler] Finished — ${loaded} loaded, ${failed} skipped/failed.\n`
  );
}

module.exports = loadCommands;