var jugando = new Set();
const AhorcadoStates = [`
|----------------
|              |
|              0
|             -|-
|              |
|             / \\
|
`,
    `
|----------------
|              |
|              0
|             -|-
|              |
|             / 
|
`,
    `
|----------------
|              |
|              0
|             -|-
|              |
|              
|`,
    `
|----------------
|              |
|              0
|             -|-
|              
|             
|`,
    `
|----------------
|              |
|              0
|             -|
|              
|             
|`,
    `
|----------------
|              |
|              0
|              |
|              
|             
|`,
    `
|----------------
|              |
|              0
| 
|              
|             
|`,
    `
|----------------
|              |
|              
| 
|              
|             
|`
]


module.exports.run = (client, message, args) => {
    let palabra = null;
    let tiempoDePartida = parseInt(args[0]) || 60e3
    if (jugando.has(message.author.id)) return message.reply("Ya estas jugando con alguien mas, o estas en una decision.");
    if (!message.mentions.users.first()) return message.reply("Necesitas mencionar a alguien con quien jugar!");

    let jugador = message.mentions.users.first();

    if (jugador.bot) return message.reply("No puedes jugar con bots.");
    if (jugador == message.author) return message.reply("Menciona a alguien mas!");
    jugando.add(message.author.id);
    jugando.add(jugador.id);

    message.reply("Envia la palabra que quisieras usar para este juego a mis mensajes directos! (tienes 15 segundos!)").then((msg) => {
        message.author.send("Envia la palabra!").catch(() => {
            msg.edit("Porfavor activa tus mensajes directos para que me puedas enviar la palabra!")
            jugando.delete(message.author.id);
            jugando.delete(jugador.id);
        }).then((m) => {
            let filter = mes => mes.author.id == message.author.id;
            let DMCollector = m.channel.createMessageCollector(filter, {
                time: 15e3
            })
            let hasCollected = false;


            DMCollector.once("collect", CollectedMessage => {
                palabra = CollectedMessage.content.toLowerCase();
                hasCollected = true;
                message.channel.send(`La palabra se ha elegido. <@${jugador.id}>, quieres jugar al ahorcado con <@${message.author.id}>? (No reacciones hasta que se pongan todas las reacciones!)`).then((PromptMessage) => {
                    PromptMessage.react("✅").then(() => PromptMessage.react("❌").then(() => {
                        PromptMessage.edit(`La palabra se ha elegido. <@${jugador.id}>, quieres jugar al ahorcado con <@${message.author.id}>?`);
                        let ReactionFilter = (reaction, user) => user.id === jugador.id;
                        let PromptCollector = PromptMessage.createReactionCollector(ReactionFilter, {
                            time: 15e3
                        });
                        let hasCollectedPrompt = false;

                        PromptCollector.once("collect", (reaction) => {
                            hasCollectedPrompt = true;
                            //console.log(reaction)
                            switch (reaction.emoji.name) {
                                case "✅":
                                    let palabranoseq = palabra.split('');
                                    let unrevealedWord = "_".repeat(palabranoseq.length).split('');
                                    var gameState = 7;
                                    PromptMessage.delete()
                                    msg.delete()
                                    message.reply("Empezando el juego!").then(AhorcadoMessage => {
                                        AhorcadoMessage.edit(`\`\`\`${AhorcadoStates[gameState]}

Palabra: ${unrevealedWord.join(' ')}\`\`\``).then(() => {
                                            const PalabrasFilter = m => m.author == jugador;
                                            let hasWin = false;
                                            let hasLost = false;
                                            const PalabrasCollector = message.channel.createMessageCollector(PalabrasFilter, {
                                                time: tiempoDePartida
                                            });
                                            PalabrasCollector.on('collect', m => {
                                                if (!(hasWin ^ hasLost)) {
                                                    if (palabranoseq.includes(m.content)) {
                                                        palabranoseq.forEach((char, i) => {
                                                            if (char == m.content) unrevealedWord[i] = m.content
                                                            // console.log(palabranoseq)
                                                        })
                                                        if(JSON.stringify(palabranoseq) == JSON.stringify(unrevealedWord)) {
                                                          hasWin = true;
                                                          AhorcadoMessage.edit(`<@${jugador.id}> ha ganado! La palabra era: ${palabra}`);
                                                          jugando.delete(message.author.id);
                                                          jugando.delete(jugador.id);
                                                        } else {
                                                          AhorcadoMessage.edit(`\`\`\`${AhorcadoStates[gameState]}

Palabra: ${unrevealedWord.join(' ')}\`\`\``);
                                                        };
                                                    } else {
                                                        gameState--
                                                        AhorcadoMessage.edit(`\`\`\`${AhorcadoStates[gameState]}

Palabra: ${unrevealedWord.join(' ')}\`\`\``)
                                                        if (gameState <= 0) {
                                                            AhorcadoMessage.edit(`<@${message.author.id}> ha ganado! La palabra era: ${palabra}`)
                                                            jugando.delete(message.author.id);
                                                            jugando.delete(jugador.id);
                                                        }
                                                    }

                                                    //console.log(unrevealedWord)
                                                    m.delete()
                                                }
                                            });

                                            PalabrasCollector.on('end', collected => {
                                              if(!(hasWin)) {
                                                AhorcadoMessage.edit(`Se ha acabado el tiempo! La palabra era: ${palabra}`)
                                                jugando.delete(message.author.id);
                                                jugando.delete(jugador.id);
                                              }
                                            });
                                        })
                                    });
                                    break;
                                case "❌":
                                    message.reply(":(");
                                    jugando.delete(message.author.id);
                                    jugando.delete(jugador.id);
                                    break;
                            }
                        })

                        PromptCollector.once("end", () => {
                            if (!hasCollectedPrompt) {
                                message.reply("El usuario no respondio a tiempo.");
                                jugando.delete(message.author.id);
                                jugando.delete(jugador.id);
                            };

                        })

                    }));
                })
            })

            DMCollector.once("end", () => {
                if (!hasCollected) {
                    jugando.delete(message.author.id);
                    jugando.delete(jugador.id);
                    message.channel.send("Se acabo el tiempo.");
                    return message.author.send("Se acabo el tiempo.");
                }
            })
        })
    })
}