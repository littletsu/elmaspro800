var Jugando = new Set(); // TODO: Hacer compatible el set con el comando de ahorcado tal vez poniendole una propiedad al client
var RPSReactions = ['💎', '📜', '✂'];


module.exports.run = (client, message, args) => {
  if(Jugando.has(message.author.id)) return message.reply('Ya estas jugando con alguien mas o alguien quiere jugar contigo!');
  if(!message.mentions.users.first()) return message.reply('Menciona a alguien para jugar!');
  var player1 = message.author; // el autor del mensaje
  var player2 = message.mentions.users.first(); // la persona mencionada
  
  // Comprobaciones del jugador2
  if(player2.bot) return message.reply("No puedes jugar con un bot!");
  if(Jugando.has(player2.id)) return message.reply('Con quien estas intentando jugar ya esta jugando con alguien mas o tiene una pregunta pendiente!')
  
  // Se agregan a los dos jugadores al set de jugando
  Jugando.add(player1.id);
  Jugando.add(player2.id);
  
  
  // Preguntarle al jugador2 si quiere jugar con el jugador1 con un reactioncollector
  var Prompt = `${player2} quisieras jugar a piedra, papel o tijera con ${player1}?`
  
  message.channel.send(`${Prompt}\n(Reacciona cuando dejes de ver esto)`).then((JugarMessage) => {
    JugarMessage.react('✅').then(() => {
      JugarMessage.react('❌').then(() => {
        JugarMessage.edit(Prompt);
        
        var FiltroJugarCollector = (_, user) => user.id == player2.id;
        var JugarCollector = JugarMessage.createReactionCollector(FiltroJugarCollector, {time: 15000*2});
        var JugarCollected = false;
        
        // Posible bug: el collector dejara de funcionar si se pone una reaccion que no es el checkmark o la x
        
        JugarCollector.once('collect', (reaction) => {
          JugarCollected = true;
          switch(reaction.emoji.name) {
            case '✅':
              message.channel.send(`El juego concluira en los mensajes privados!`).then(() => {
                player1.send(`Elije! (Espera a que se pongan todas las reacciones!)`).then((P1Msg) => {                  
                  player2.send(`Elije! (Espera a que se pongan todas las reacciones!)`).then((P2Msg) => {
                    for(var i = 0; i <= RPSReactions.length; i++) {
                      P1Msg.react(RPSReactions[i]);
                      P2Msg.react(RPSReactions[i]);
                    }
                  }).catch(() => {
                    message.reply(`El juego no podra concluir, ${player2} tiene los mensajes privados desactivados! :(`);
                    Jugando.delete(player1.id);
                    Jugando.delete(player2.id);
                  })
                }).catch(() => {
                  message.reply('El juego no podra concluir, tienes los mensajes privados desactivados!1!!!111');
                  Jugando.delete(player1.id);
                  Jugando.delete(player2.id);
                }) 
              });
              break;
            
            case '❌':
              message.reply(`:(`);
              Jugando.delete(player1.id);
              Jugando.delete(player2.id);
              break;
          }
        })
        
        JugarCollector.once('end', () => {
          // Si se acaba el tiempo y el jugador2 aun no ha respondido se quitan a los dos usuarios del set de jugando
          if(!JugarCollected) {
            message.reply(`El tiempo para que ${player2} respondiera se ha acabado!`);
            Jugando.delete(player1.id);
            Jugando.delete(player2.id);
          }
        })
        
      }) 
    })

  })
}