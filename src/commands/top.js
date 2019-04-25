module.exports.run = (client, message, args) => {
   client.TypeRacerDB.datos().then(datos => {
   var datosI = []
   for(var dato in datos) {
     datosI.push([dato, datos[dato].wins, datos[dato].record])
    }
    var sortedUsers = datosI.sort(function(a, b) {
            return b[1] - a[1]
     });
      let promedio = 0;
  
     message.channel.send(sortedUsers.map((user, i) => {
        let promedio = 0;
        user[2].map(num => promedio = promedio+num)
       return `${i+1}. ${client.users.get(user[0]).tag} - ${user[1]} wins (${(promedio / user[2].length).toString() === "NaN" ? "???" : promedio / user[2].length}s)`
     }).join('\n'))
})
}