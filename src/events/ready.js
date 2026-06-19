module.exports = {
    name: "clientReady",
    once: true,
    execute(client){
        console.log(`[Ready] ✅  Logged in as ${client.user.tag}`);
        console.log(`[Ready] 🌐  Serving ${client.guilds.cache.size} guild(s).`);
    }
}