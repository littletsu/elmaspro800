var jugando = new Set();

module.exports.run = (client, message, args) => {
  let palabra = null;
  if(jugando.has(message.author.id)) return message.reply("Ya estas jugando con alguien mas, o estas en una decision.");
  if(!message.mentions.users.first()) return message.reply("Necesitas mencionar a alguien con quien jugar!");
  
  let jugador = message.mentions.users.first();
  
  if(jugador.bot) return message.reply("No puedes jugar con bots.");
  if(jugador == message.author) return message.reply("Menciona a alguien mas!");
  jugando.add(message.author.id);
  jugando.add(jugador.id);
  
  message.reply("Envia la palabra que quisieras usar para este juego a mis mensajes directos! (tienes 15 segundos!)").then((msg) => {
    message.author.send("Envia la palabra!").catch(() => {
      msg.edit("Porfavor activa tus mensajes directos para que me puedas enviar la palabra!")
      jugando.delete(message.author.id);
      jugando.delete(jugador.id);
    }).then((m) => {
      let filter = mes => mes.author.id == message.author.id;
      let DMCollector = m.channel.createMessageCollector(filter, {time: 15e3})
      let hasCollected = false;
      
      
      DMCollector.once("collect", CollectedMessage => {
        palabra = CollectedMessage.content;
        hasCollected = true;
        message.channel.send(`La palabra se ha elegido. <@${jugador.id}>, quieres jugar al ahorcado con <@${message.author.id}>? (No reacciones hasta que se pongan todas las reacciones!)`).then((PromptMessage) => {
          PromptMessage.react("✅").then(() => PromptMessage.react("❌").then(() => {
            PromptMessage.edit(`La palabra se ha elegido. <@${jugador.id}>, quieres jugar al ahorcado con <@${message.author.id}>?`);
            let ReactionFilter = (reaction, user) => user.id === jugador.id;
            let PromptCollector = PromptMessage.createReactionCollector(ReactionFilter, { time: 15e3});
            let hasCollectedPrompt = false;

            PromptCollector.once("collect", (reaction) => {
              hasCollectedPrompt = true;
              console.log(reaction)
              switch(reaction.emoji.name) {
                case "✅":
                  message.reply("Empezando el juego!");
                  break;
                case "❌":
                  message.reply(":(");
                  jugando.delete(message.author.id);
                  jugando.delete(jugador.id);
                  break;
              }
            })
            
            PromptCollector.once("end", () => {
              if(!hasCollectedPrompt) return {
                message.reply("El usuario no respondio a tiempo.")
                jugando.delete(message.author.id);
              jugando.delete(jugador.id);
            };
              
            })
            
          }));
        })
      })
      
      DMCollector.once("end", () => {
        if(!hasCollected) {
          jugando.delete(message.author.id);
          jugando.delete(jugador.id);
          message.channel.send("Se acabo el tiempo.");
          return message.author.send("Se acabo el tiempo.");
        }
      })
    })
  })
}
