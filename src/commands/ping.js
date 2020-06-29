module.exports.run = (client, message, args) => {
    message.reply(client.ws.ping + 'ms');
};
