const mineflayer = require('mineflayer');
const http = require('http');

// Configuración del servidor (puedes usar variables de entorno o ponerlos directo)
const CONFIG = {
    host: process.env.MC_HOST || 'tu-servidor.aternos.me',
    port: parseInt(process.env.MC_PORT || '25565'),
    username: process.env.MC_USERNAME || 'BotCiclico',
    version: process.env.MC_VERSION || false // false detecta la versión automáticamente
};

function runBotCycle() {
    console.log(`[${new Date().toLocaleTimeString()}] Intentando conectar al servidor...`);
    
    const bot = mineflayer.createBot({
        host: CONFIG.host,
        port: CONFIG.port,
        username: CONFIG.username,
        version: CONFIG.version
    });

    bot.once('spawn', () => {
        console.log('¡Bot conectado con éxito! Esperando 1 minuto antes de salir...');
        
        // Mantener al bot dentro exactamente 60 segundos (1 minuto)
        setTimeout(() => {
            console.log('Desconectando el bot (fin del minuto dentro)...');
            bot.quit();
            scheduleReconnect();
        }, 60000);
    });

    bot.on('error', (err) => {
        console.log('Error en el bot:', err.message);
    });

    bot.on('end', (reason) => {
        console.log(`Bot desconectado. Razón: ${reason}`);
    });
}

function scheduleReconnect() {
    console.log('Esperando 1 minuto fuera del servidor para volver a entrar...');
    // Esperar otros 60 segundos (1 minuto) antes de volver a iniciar el ciclo
    setTimeout(() => {
        runBotCycle();
    }, 60000);
}

// Iniciar el primer ciclo
runBotCycle();

// Servidor HTTP básico obligatorio para plataformas como Render (para que no marquen error de puertos)
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot de Minecraft activo en ciclos de 1 minuto.\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor HTTP escuchando en el puerto ${PORT}`);
});
