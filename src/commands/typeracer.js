module.exports.run = (client, message, args) => {
  message.channel.send("Empezando en 6...").then(msg => {
    var i = 6, min = 0;

    function EmpezarJuego() {
      msg.edit("Empezamos! Se mas rapido que los demas en escribir lo siguiente: ")
    }
    
    function Bucle() {
      i--
      if(!(i < min)) {
        setTimeout(() => {
          msg.edit(`Empezando en ${i}...`).then(() => {
            Bucle();
          })
        }, 1000)
      } else {
        EmpezarJuego();
      }
    } 
    Bucle();
    
  })
}