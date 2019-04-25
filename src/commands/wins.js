module.exports.run = async (client, message, args) => {
  client.TypeRacerDB.obtener('266063988209483790').then(datos => {
    let promedio = 0;
    datos.record.map(num => promedio = promedio+num)
    message.reply(`Tus wins en TypeRacer son: ${datos.wins}\nLo que tardas en escribir una oracion en promedio son: ${promedio == 0 ? "Aun no ha sido calculado." : promedio / datos.record.length}s`)
  })
}