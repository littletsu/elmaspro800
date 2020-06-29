var Discord = require('discord.js');
var client = new Discord.Client(); //client? no grasias prefiero "ProClient"
var config = { prefix: 'pro!' }; //best prefix XDXD
const db = require('mega-dtbs');
const token = process.env.TOKEN || process.argv[2];
client.TypeRacerDB = new db.crearDB('TypeRacer');
client.TypeRacerDB.checkUser = user => {
    if (!client.TypeRacerDB.tiene(user.id || user))
        client.TypeRacerDB.agregar(user.id || user, { wins: 0, record: [] });
};

// XD lol XDXXDXD
client.on('ready', () => {
    console.log('el mas proo 800 esta redy :sunglasses:'); //q pro
    client.user.setActivity('Version de prueba', { type: 'CUSTOM_STATUS' });
});

client.on('message', message => {
    try {
        if (
            message.mentions.users.first() &&
            message.mentions.users.first().id == '566499804813983745'
        )
            return message.reply('Explora mis comandos con `pro!help`');
        if (message.content.indexOf(config.prefix) !== 0) return;

        const args = message.content
            .slice(config.prefix.length)
            .trim()
            .split(/ +/g);
        let command = args.shift().toLowerCase();

        let commandFile = require(`./src/commands/${command}.js`);
        commandFile.run(
            client,
            message,
            args,
            client.TypeRacerDB.checkUser(message.author)
        );
    } catch (err) {
        if (err.message === `Cannot read property 'config' of undefined`)
            return;
        if (err.code == 'MODULE_NOT_FOUND') return;
        console.error(err);
    }
});

client.login(token);
