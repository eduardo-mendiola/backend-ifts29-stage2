import 'dotenv/config';
import app from './src/app.js';
import db from './src/config/db.js';
const PORT = process.env.PORT || 3000;

(async () => {
    await db.initialize(); // Se carga la DB
    console.log('DB lista');

    // Arranca el servidor
    app.listen(PORT, () => {
        console.log(`Servidor de ClickWave corriendo en http://localhost:${PORT}`);
    });
})();
