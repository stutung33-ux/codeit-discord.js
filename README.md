# codeit Bot

A Discord bot built with [discord.js v14](https://discord.js.org/), developed episodically as part of the **codeit** YouTube series.

[![YouTube](https://img.shields.io/badge/YouTube-codeitofficial3-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/@codeitofficial3)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-ashutoshswamy-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/ashutoshswamy)

---

## Episodes

### Episode 1 — Project Setup & First Commands

**Files added:** `index.js`, `package.json`, `.gitignore`

- Initialized Node.js project with `discord.js` and `dotenv` dependencies
- Created a `Client` with `Guilds`, `GuildMessages`, and `MessageContent` intents
- Handled the `clientReady` event to log the bot tag on login
- Added prefix-based message commands:
  - `!ping` → replies `Pong!`
  - `!youtube` → replies with the channel link

---

### Episode 2 — Slash Commands & Embeds

**Files changed:** `index.js`

- Registered slash commands via Discord REST API (`applicationCommands` route)
- Added two slash commands:
  - `/ping` → replies with `Pong!` (ephemeral)
  - `/serverinfo` → replies with a rich embed showing server name, icon, member count, creation date
- Handled `interactionCreate` event to route slash command interactions

---

### Episode 3 — Project Restructure & Handler Architecture

**Files added:** `src/index.js`, `src/config.js`, `src/deployCommands.js`, `src/handlers/commandHandler.js`, `src/handlers/eventHandler.js`, `src/events/ready.js`, `src/events/interactionCreate.js`, `src/commands/utility/ping.js`

- Migrated from single `index.js` to structured `src/` directory
- Extracted intents into `src/config.js`
- **Command Handler** (`src/handlers/commandHandler.js`): recursively walks `src/commands/`, validates `data` + `execute` exports, loads all commands into `client.commands` Collection
- **Event Handler** (`src/handlers/eventHandler.js`): reads `src/events/`, registers handlers supporting both `once` and `on` events
- **Deploy Script** (`src/deployCommands.js`): pushes slash commands to Discord; supports `--guild` (dev) and `--global` (production) flags
- Converted `/ping` to standalone module with latency embed showing roundtrip and WebSocket heartbeat
- `ready.js` logs guild count on startup
- `interactionCreate.js` handles unknown commands with ephemeral error replies

**npm scripts added:**

```
npm start              # node src/index.js
npm run dev            # node --watch src/index.js
npm run deploy:guild   # deploy commands to test guild
npm run deploy:global  # deploy commands globally
```

---

### Episode 4 — New Utility Commands

**Files added:** `src/commands/utility/echo.js`, `src/commands/utility/userinfo.js`

- `/echo <message>` — repeats the user's input back as a reply
- `/userinfo [user]` — displays member info embed:
  - Username, user tag, bot status
  - Server join date (relative timestamp)
  - Account creation date (full timestamp)
  - User avatar as thumbnail
  - Defaults to command invoker if no user specified

---

### Episode 5 — Message Components & Button Interactions

**Files added:** `src/commands/utility/feedback.js`  
**Files changed:** `src/events/interactionCreate.js`

- `/feedback` — sends a button-based feedback prompt with 30s collector:
  - **Good** (green) → updates message with thank-you reply
  - **Bad** (red) → updates message with improvement reply
  - Buttons disabled automatically when collector expires
  - Guards against other users clicking (ephemeral rejection)
- Fixed `interactionCreate.js` error handler: now checks `interaction.replied` / `interaction.deferred` before choosing `followUp` vs `reply`, preventing double-reply crashes; error reply now ephemeral

---

### Episode 6 — Select Menu Interactions

**Files added:** `src/commands/utility/menu.js`

- `/color` — sends a `StringSelectMenu` with 3 color options (Red, Blue, Yellow) and 30s collector:
  - Each selection updates the message with a confirmation reply and removes the menu
  - Guards against other users selecting (ephemeral rejection)
  - Menu disabled automatically when collector expires
- Demonstrates `StringSelectMenuBuilder`, `StringSelectMenuOptionBuilder`, and `ActionRowBuilder` patterns

---

### Episode 7 — Modal Forms

**Files added:** `src/commands/utility/apply.js`  
**Files changed:** `src/events/interactionCreate.js`

- `/apply` — opens a `ModalBuilder` staff application form with two inputs:
  - `name_input` — short text, required, placeholder "e.g. John Doe"
  - `app_reason` — paragraph text, required, 10–500 chars
- `interactionCreate.js` updated to handle `isModalSubmit()`:
  - Reads `name_input` + `app_reason` field values
  - Replies ephemerally with submitted data confirmation
  - Logs submission to console
  - Returns early so slash command routing is unaffected

---

## Setup

```bash
npm install
```

Create a `.env` file:

```env
BOT_TOKEN=your_bot_token
CLIENT_ID=your_client_id
GUILD_ID=your_test_guild_id
```

Deploy commands then start:

```bash
npm run deploy:guild   # or deploy:global for production
npm run dev            # or npm start
```
