import 'dotenv/config';
import app from './src/app.js';
import dbConnect from './src/config/db.js';
import RoleExpirationScheduler from './src/services/RoleExpirationScheduler.js';

const PORT = process.env.PORT || 3000;

(async () => {
    await dbConnect(); // Conecta a MongoDB
    console.log('----------------------------------\n  BASE DE DATOS MONGO DB LISTA \n----------------------------------');

    // Iniciar scheduler de roles temporales (solo si no estamos en modo test)
    if (process.env.NODE_ENV !== 'test') {
        RoleExpirationScheduler.start();
    }

    app.listen(PORT, () => {
        console.log(`=> Servidor de ClickWave corriendo en http://localhost:${PORT}`);
    });
})();
