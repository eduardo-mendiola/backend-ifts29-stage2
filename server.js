import 'dotenv/config';
import app from './src/app.js';
import dbConnect from './src/config/db.js';

const PORT = process.env.PORT || 3000;

(async () => {
    await dbConnect(); // Conecta a MongoDB
    console.log('DB lista');

    app.listen(PORT, () => {
        console.log(`Servidor de ClickWave corriendo en http://localhost:${PORT}`);
    });
})();
