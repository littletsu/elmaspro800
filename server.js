var Discord = require('discord.js');
var client = new Discord.Client(); //client? no grasias prefiero "ProClient"
var config = {prefix: "pro!"}; //best prefix XDXD
// XD lol XDXXDXD
client.on("ready", () => {
  console.log("el mas proo 800 esta redy :sunglasses:") //q pro
})

client.on("message", message => {
  try {
        if (message.author.bot) return;
        if(message.mentions.users.first() && message.mentions.users.first().id == "566499804813983745") return message.reply("mi prefiks es pro! qcresi no¿. mi comando de ayuda es help XD XD");
        if (message.content.indexOf(config.prefix) !== 0) return;

        const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        let command = args.shift().toLowerCase();

        let commandFile = require(`./src/commands/${command}.js`);
        commandFile.run(client, message, args);

  } catch (err) {
        if (err.message === `Cannot read property 'config' of undefined`) return;
        if (err.code == "MODULE_NOT_FOUND") return;
        console.error(err);
  }
})

client.login(process.env.TOKEN)