module.exports.run = async (client, message, args) => {
  var id = message.mentions.users.first().id
  message.reply(`${message.mentions.users.first() ? `Las wins de ${message.mentions.users.first().tag}` : `Tus wins`} en TypeRacer son: ${await client.TypeRacerDB.obtener(id || message.author.id + '.wins')}`)
}