require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const axios = require('axios');

// Configuración de la API
const API_KEY = process.env.DEEPSEEK_API_KEY;
const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "deepseek/deepseek-chat:free";

// Configuración del bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Estado del bot por canal
const channelStates = new Map();
const userPersonalities = new Map();
const userAvatars = new Map();
const userDisplayNames = new Map();

// Comandos disponibles
const commands = [
  {
    name: 'startbot',
    description: 'Activa el bot en este canal'
  },
  {
    name: 'detener',
    description: 'Desactiva el bot en este canal'
  },
  {
    name: 'personalidad',
    description: 'Establece una personalidad para el bot',
    options: [
      {
        name: 'descripcion',
        description: 'Descripción de la personalidad',
        type: 3,
        required: true
      }
    ]
  },
  {
    name: 'modificacion_de_foto',
    description: 'Cambia la foto de perfil del bot',
    options: [
      {
        name: 'url',
        description: 'URL de la nueva imagen',
        type: 3,
        required: true
      }
    ]
  },
  {
    name: 'modificacion_de_nombre',
    description: 'Cambia el nombre de visualización del bot',
    options: [
      {
        name: 'nombre',
        description: 'Nuevo nombre de visualización',
        type: 3,
        required: true
      }
    ]
  }
];

// Registrar comandos cuando el bot esté listo
client.once('ready', async () => {
  console.log(`Bot conectado como ${client.user.tag}`);
  
  try {
    await client.application.commands.set(commands);
    console.log('Comandos registrados exitosamente');
  } catch (error) {
    console.error('Error al registrar comandos:', error);
  }
});

// Función para interactuar con la API de DeepSeek
async function queryDeepSeek(prompt, userId) {
  const personality = userPersonalities.get(userId) || "Eres un asistente de IA útil, educado y detallado.";
  
  const messages = [
    {
      role: "system",
      content: personality
    },
    {
      role: "user",
      content: prompt
    }
  ];

  try {
    const response = await axios.post(API_URL, {
      model: MODEL,
      messages: messages
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error al consultar la API:', error.response?.data || error.message);
    return "Lo siento, hubo un error al procesar tu solicitud.";
  }
}

// Manejar interacciones de comandos
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName, options, channelId, user } = interaction;

  try {
    switch (commandName) {
      case 'startbot':
        channelStates.set(channelId, true);
        await interaction.reply({ 
          content: '🤖 **Bot activado** en este canal. Ahora puedes hablar directamente conmigo.', 
          ephemeral: false 
        });
        break;

      case 'detener':
        channelStates.set(channelId, false);
        await interaction.reply({ 
          content: '🛑 **Bot desactivado** en este canal. Usa /startbot para volver a activarme.', 
          ephemeral: false 
        });
        break;

      case 'personalidad':
        const personality = options.getString('descripcion');
        userPersonalities.set(user.id, personality);
        await interaction.reply({ 
          content: `✅ Personalidad actualizada. Ahora me comportaré como: "${personality}"`, 
          ephemeral: true 
        });
        break;

      case 'modificacion_de_foto':
        const imageUrl = options.getString('url');
        userAvatars.set(user.id, imageUrl);
        
        // Crear un embed para mostrar la nueva imagen
        const embed = new EmbedBuilder()
          .setTitle('Nueva imagen de perfil')
          .setImage(imageUrl)
          .setColor('#0099ff');
        
        await interaction.reply({ 
          embeds: [embed], 
          ephemeral: true 
        });
        break;

      case 'modificacion_de_nombre':
        const displayName = options.getString('nombre');
        userDisplayNames.set(user.id, displayName);
        await interaction.reply({ 
          content: `✅ Nombre de visualización actualizado a: "${displayName}"`, 
          ephemeral: true 
        });
        break;

      default:
        await interaction.reply({ 
          content: 'Comando no reconocido.', 
          ephemeral: true 
        });
    }
  } catch (error) {
    console.error('Error al procesar comando:', error);
    await interaction.reply({ 
      content: 'Ocurrió un error al procesar tu comando.', 
      ephemeral: true 
    });
  }
});

// Manejar mensajes en canales donde el bot está activo
client.on('messageCreate', async message => {
  // Ignorar mensajes del propio bot o cuando no está activo en el canal
  if (message.author.bot || !channelStates.get(message.channel.id)) return;

  try {
    // Mostrar que el bot está escribiendo
    await message.channel.sendTyping();

    // Obtener respuesta de DeepSeek
    const response = await queryDeepSeek(message.content, message.author.id);

    // Personalizar la respuesta según las preferencias del usuario
    const displayName = userDisplayNames.get(message.author.id) || 'DeepSeek Chat';
    const avatarURL = userAvatars.get(message.author.id) || client.user.displayAvatarURL();

    // Crear un embed para la respuesta
    const responseEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setDescription(response)
      .setAuthor({
        name: displayName,
        iconURL: avatarURL
      })
      .setFooter({ text: 'Powered by DeepSeek R-1' });

    await message.reply({ embeds: [responseEmbed] });
  } catch (error) {
    console.error('Error al procesar mensaje:', error);
    await message.reply('Lo siento, ocurrió un error al procesar tu mensaje.');
  }
});

// Iniciar el bot
client.login(process.env.DISCORD_TOKEN);
