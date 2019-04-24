module.exports.run = (client, message, args) => {
   client.TypeRacerDB.datos().then(datos => {
   var datosI = []
   for(var dato in datos) {
     datosI.push([dato, datos[dato].wins])
    }
    var sortedUsers = datosI.sort(function(a, b) {
            return b[1] - a[1]
     });
     message.channel.send(sortedUsers.map((user, i) => `${i+1}. ${client.users.get(user[0]).tag} - ${user[1]} wins`).join('\n'))
})
}