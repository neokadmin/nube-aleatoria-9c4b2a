const mineflayer = require('mineflayer');
const http = require('http');

// Configuración del servidor de Minecraft
const CONFIG = {
    host: process.env.MC_HOST || 'servidorparaamigos.seedloaf.gg',
    port: parseInt(process.env.MC_PORT || '61126'),
    username: process.env.MC_USERNAME || 'BotCiclico',
    version: process.env.MC_VERSION || '1.20.4', // O la versión soportada por tu servidor
    auth: 'offline' // Usar modo offline para evitar "Failed to verify username!"
};

// Contador de peticiones para seguimiento en la consola
let pingCount = 0;

function runBotCycle() {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`\n[${timestamp}] 🔄 Intentando conectar al servidor de Minecraft (${CONFIG.host})...`);
    
    const bot = mineflayer.createBot({
        host: CONFIG.host,
        port: CONFIG.port,
        username: CONFIG.username,
        version: CONFIG.version,
        auth: CONFIG.auth
    });

    bot.once('spawn', () => {
        const spawnTime = new Date().toLocaleTimeString();
        console.log(`[${spawnTime}] 🟢 ¡BOT CONECTADO CON ÉXITO! Jugador en línea: ${bot.username}`);
        console.log(`[${spawnTime}] ⏱️ Permaneciendo en el servidor durante 1 minuto...`);
        
        // Permanecer 60 segundos dentro del juego
        setTimeout(() => {
            const quitTime = new Date().toLocaleTimeString();
            console.log(`[${quitTime}] 🔴 Salida programada alcanzada. Desconectando bot...`);
            bot.quit();
            scheduleReconnect();
        }, 60000);
    });

    bot.on('error', (err) => {
        console.log(`[${new Date().toLocaleTimeString()}] ⚠️ Error en el bot: ${err.message}`);
    });

    bot.on('end', (reason) => {
        console.log(`[${new Date().toLocaleTimeString()}] 🚪 Bot desconectado del servidor. Razón: ${reason}`);
    });
}

function scheduleReconnect() {
    console.log(`[${new Date().toLocaleTimeString()}] ⏳ Esperando 1 minuto fuera antes de reconectar...`);
    setTimeout(() => {
        runBotCycle();
    }, 60000);
}

// Iniciar el ciclo del bot de Minecraft
runBotCycle();

// Servidor HTTP preparado para UptimeRobot
const server = http.createServer((req, res) => {
    pingCount++;
    const reqTime = new Date().toLocaleTimeString();
    const userAgent = req.headers['user-agent'] || 'Desconocido';
    
    // Log visible en la terminal de Render cada vez que UptimeRobot (o un navegador) consulta el servicio
    console.log(`[${reqTime}] 🌐 [PING #${pingCount}] Solicitud HTTP recibida de: ${userAgent}`);

    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Bot de Minecraft activo.\nPeticiones recibidas: ${pingCount}\nÚltima comprobación: ${reqTime}\n`);
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`[${new Date().toLocaleTimeString()}] 🚀 Servidor HTTP escuchando en el puerto ${PORT}`);
    console.log(`[${new Date().toLocaleTimeString()}] 🔗 Apunta tu monitor de UptimeRobot a la URL de Render para mantener el servicio activo 24/7.`);
});
