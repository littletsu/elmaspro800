module.exports.run = (client, message, args) => {
  let palabra = null;
  
  if(!message.mentions.users.first()) return message.reply("Necesitas mencionar a alguien con quien jugar!");
  
  let jugador = message.mentions.users.first();
  
  if(jugador.bot) return message.reply("No puedes jugar con bots.");
  if(jugador == message.author) return message.reply("Menciona a alguien mas!");
  
  message.reply("Envia la palabra que quisieras usar para este juego a mis mensajes directos! (tienes 15 segundos!)").then((msg) => {
    message.author.send("Envia la palabra!").catch(() => {
      msg.edit("Porfavor activa tus mensajes directos para que me puedas enviar la palabra!")
    }).then((m) => {
      let filter = mes => mes.author.id == message.author.id;
      let DMCollector = m.channel.createMessageCollector(filter, {time: 15e3})
      let hasCollected = false;
      
      
      DMCollector.once("collect", CollectedMessage => {
        palabra = CollectedMessage.content;
        hasCollected = true;
        message.channel.send(`La palabra se ha elegido. <@${jugador.id}>, quieres jugar al ahorcado con <@${message.author.id}>? (No reacciones hasta que se pongan todas las reacciones!)`).then((PromptMessage) => {
          PromptMessage.react("✅").then(() => PromptMessage.react("❌").then(() => {
            let filter = (reaction, user) => (reaction.emoji.name === '❌' || reaction.emoji.name === '✅') && user.id === jugador.id;
            let collector = message.createReactionCollector(filter, { time: 60e3 });
            collector.on('collect', r => console.log(`Collected ${r.emoji.name}`));
            collector.on('end', collected => console.log(`Collected ${collected.size} items`));
          }));
        })
      })
      
      DMCollector.once("end", () => {
        if(!hasCollected) return message.author.send("Se acabo el tiempo.");
      })
    })
  })
}