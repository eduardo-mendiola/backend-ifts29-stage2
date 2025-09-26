import mongoose from 'mongoose';
import 'dotenv/config';

const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/clickwavedb';

const dbConnect = async () => {
    try {
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conectado a la base de datos MongoDB');
    } catch (error) {
        console.error('Error al conectar a la DB:', error.message);
        process.exit(1);
    }
};

export default dbConnect;
