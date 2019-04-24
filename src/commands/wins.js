module.exports.run = async (client, message, args) => {
  message.reply(`Tus wins en TypeRacer son: ${await client.TypeRacerDB.obtener(message.author.id + '.wins')}`)
}