module.exports.run = (client, message, args) => {
  let palabra = null;
  
  if(!message.mentions.users.first()) message.reply("Necesitas mencionar a alguien con quien jugar!");
  message.reply("Envia la palabra que quisieras usar para este juego a mis mensajes directos! (tienes 15 segundos!)").then((msg) => {
    message.author.send("Envia la palabra!").catch(() => {
      msg.edit("Porfavor activa tus mensajes directos para que me puedas enviar la palabra!")
    }).then((m) => {
      let filter = mes => mes.author.id == message.author.id;
      let DMCollector = m.channel.createMessageCollector(filter, {time: 15e3})
      let hasCollected = false;
      
      
      DMCollector.once("collect", m => {
        palabra = m.content;
        hasCollected = true;
        console.log(palabra)
      })
      
      DMCollector.once("end", () => {
        if(!hasCollected) 
      })
    })
  })
}
