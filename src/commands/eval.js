function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

module.exports.run = (client, message, args) => {
  if(!((message.author.id !== "266063988209483790") || (message.author.id !== "428527516358148097"))) return message.channel.send("simon mañana ahorita ya es tarde");
  try {
      const code = args.join(" ");
      let evaled = eval(code);
      let type = typeof evaled
      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

      message.channel.send(`Result:\`\`\`js\n${clean(evaled)}\`\`\`\nType: \`${type}\``);
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
}
