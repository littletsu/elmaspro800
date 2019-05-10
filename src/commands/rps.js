var Jugando = new Set();

module.exports.run = (client, message, args) => {
  if(Jugando.has(message.author.id)) return message.reply('')
  if(!message.mentions.users.first()) return message.reply('Menciona a alguien para jugar!');
  var player1 = message.author; // el autor del mensaje
  var player2 = message.mentions.users.first(); // la persona mencionada
  
  if(player2.bot) return message.reply("No puedes jugar con un bot!");
  
  // Preguntarle al jugador2 si quiere jugar con el jugador1 con un reactioncollector
  message.channel.send(`<@${player2}> quisieras jugar a piedra, papel o tijera con <@player1>?\n(Reacciona cuando dejes de ver esto)`).then((JugarMessage) => {
    JugarMessage.react('✅')
    var FiltroJugarCollector = (_, user) => user.id == player2.id;
    var JugarCollector = JugarMessage.createReactionCollector();
  })

  
}