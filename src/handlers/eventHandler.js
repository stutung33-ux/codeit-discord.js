const fs   = require('fs');
const path = require('path');

function loadEvents(client) {
  const eventsPath = path.join(__dirname, '..', 'events');
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith('.js'));

  let loaded = 0;
  let failed = 0;

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);

    try {
      const event = require(filePath);

      // Validate the exported shape
      if (!event.name || typeof event.execute !== 'function') {
        console.warn(
          `[EventHandler] ⚠️  Skipped ${file} — missing "name" or "execute" export.`
        );
        failed++;
        continue;
      }

      if (event.once) {
        // Fires only the first time the event is emitted
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        // Fires every time the event is emitted
        client.on(event.name, (...args) => event.execute(...args, client));
      }

      loaded++;
      console.log(
        `[EventHandler] ✅  Registered event: ${event.name}${event.once ? ' (once)' : ''}`
      );
    } catch (error) {
      console.error(`[EventHandler] ❌  Failed to load ${file}:`, error);
      failed++;
    }
  }

  console.log(
    `[EventHandler] Finished — ${loaded} registered, ${failed} skipped/failed.\n`
  );
}

module.exports = loadEvents;