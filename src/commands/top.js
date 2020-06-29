module.exports.run = (client, message, args) => {
    client.TypeRacerDB.datos().then(datos => {
        var datosI = [];
        for (var dato in datos) {
            datosI.push([dato, datos[dato].wins, datos[dato].record]);
        }
        var sortedUsers = datosI.sort(function (a, b) {
            return b[1] - a[1];
        });
        let promedio = 0;
        let results = sortedUsers.map(async (user, i) => {
            let promedio = 0;
            user[2].map(num => (promedio = promedio + num));
            let DiscordUser = await client.users.fetch(user[0]);
            return `${i + 1}. ${DiscordUser.tag} - ${user[1]} wins (${
                Math.floor(promedio / user[2].length).toString() === 'NaN'
                    ? '???'
                    : Math.floor(promedio / user[2].length)
            }s)`;
        });
        Promise.all(results).then(res => {
            message.channel.send(res.join('\n'));
        });
    });
};
