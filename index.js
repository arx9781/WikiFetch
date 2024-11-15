require("dotenv").config();

const { Client, IntentsBitField } = require("discord.js");
const Wikipedia = require("wikipedia");

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "wiki") {
    const query = interaction.options.getString("query");
    try {
      const page = await Wikipedia.page(query);
      const summary = await page.summary();
      await interaction.reply(summary);
    } catch (error) {
      console.error(error);
      await interaction.reply("An error occurred while fetching the article.");
    }
  }
});

client.login(process.env.DISCORD_TOKEN);

client.once("ready", async () => {
  const commands = [
    {
      name: "wiki",
      description: "Fetches a Wikipedia article.",
      options: [
        {
          name: "query",
          description: "The query to search for.",
          type: 3, // String
          required: true,
        },
      ],
    },
  ];

  await client.application.commands.set(commands);
  console.log("Slash commands registered!");
});
