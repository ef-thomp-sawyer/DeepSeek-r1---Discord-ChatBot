# DeepSeek-r1---Discord-ChatBot
DeepSeek R-1 Chatbot para Discord by Wang WAGNER

Aquí tienes una implementación completa de un chatbot para Discord que utiliza la API de DeepSeek R-1. El bot incluye todos los comandos solicitados.

# Estructura del proyecto
```
deepseek-discord-bot/
├── .env
├── package.json
└── index.js
```

# Configuración inicial
• Primero, crea un archivo ```.env``` en la raíz de tu proyecto con el siguiente contenido:

```.env```
```
DISCORD_TOKEN=tu_token_de_discord_aquí
DEEPSEEK_API_KEY=tu_clave_api_de_deepseek_aquí
DISCORD_CLIENT_ID=tu_id_de_cliente_de_discord_opcional
```

# Características del Bot
## Comandos Slash:
• ```/startbot```: Activa el bot en el canal actual.

• ```/detener```: Desactiva el bot en el canal actual.

• ```/personalidad [descripcion]```: Establece una personalidad personalizada.

• ```/modificacion_de_foto [url]```: Cambia la foto de perfil del bot.

• ```/modificacion_de_nombre [nombre]```: Cambia el nombre de visualización del bot.

## Funcionalidades:
• Respuestas contextuales usando DeepSeek R-1.

• Personalización por usuario (cada usuario puede tener su propia configuración).

• Estado por canal (puede estar activo en unos canales e inactivo en otros).

• Respuestas en formato embed con imagen y nombre personalizable.

## Requisitos:
• Node.js 16.9.0 o superior

• Token de Discord válido

• API key de DeepSeek R-1

# Instrucciones de uso
• Instala las dependencias:
```npm install```

• Configura el archivo ```.env``` con tus credenciales

• Inicia el bot:
```npm start```

El bot registrará automáticamente los comandos slash y estará listo para interactuar en los canales donde se active con ```/startbot```.

## Añadir al Servidor (OAuth2)
Personal DEMO
https://discord.com/oauth2/authorize?client_id=1372262086440386570&permissions=8&integration_type=0&scope=bot

## Véase también 

Creating a Bot Account
https://discordpy.readthedocs.io/en/stable/discord.html y discord.js

### powered by silly & bolchas c
