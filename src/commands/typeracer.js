module.exports.run = (client, message, args) => {
  message.channel.send("Empezando en 6...").then(msg => {
    for(var i = 5; i > 0; i--) {
     setTimeout(() => {
       msg.edit(`Empezando en ${i}...`)
     }, 1000)
    }
  })
}