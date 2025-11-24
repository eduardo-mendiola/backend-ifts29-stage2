import 'dotenv/config';
import app from './src/app.js';
import dbConnect from './src/config/db.js';
import RoleExpirationScheduler from './src/services/RoleExpirationScheduler.js';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

const PORT = process.env.PORT || 3000;

(async () => {
    await dbConnect(); // Conecta a MongoDB
    console.log('----------------------------------\n  BASE DE DATOS MONGO DB LISTA \n----------------------------------');

    // Iniciar scheduler de roles temporales (solo si no estamos en modo test)
    if (process.env.NODE_ENV !== 'test') {
        RoleExpirationScheduler.start();
    }

    const httpServer = http.createServer(app);
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // Import models for chat
    const Message = (await import('./src/models/Message.js')).default;
    const Conversation = (await import('./src/models/Conversation.js')).default;

    io.on('connection', (socket) => {
        console.log('🔌 New client connected:', socket.id);

        // Join user to their conversation rooms
        socket.on('join-conversations', async (userId) => {
            try {
                // Join user's personal room for notifications
                socket.join(userId);
                console.log(`User ${userId} joined personal room: ${userId}`);

                const conversations = await Conversation.find({
                    participants: userId
                });

                conversations.forEach(conv => {
                    socket.join(conv.conversationId);
                    console.log(`User ${userId} joined room: ${conv.conversationId}`);
                });
            } catch (error) {
                console.error('Error joining conversations:', error);
            }
        });

        // Handle new message
        socket.on('chat-message', async (data) => {
            try {
                const { senderId, receiverId, text, conversationId } = data;

                // Create message in database
                const message = new Message({
                    sender: senderId,
                    receiver: receiverId,
                    text,
                    conversationId
                });

                await message.save();
                await message.populate('sender', 'username');
                await message.populate('receiver', 'username');

                // Update or create conversation
                let conversation = await Conversation.findOne({ conversationId });

                if (!conversation) {
                    conversation = new Conversation({
                        conversationId,
                        participants: [senderId, receiverId],
                        lastMessage: text,
                        lastMessageTime: new Date()
                    });
                } else {
                    conversation.lastMessage = text;
                    conversation.lastMessageTime = new Date();
                    // Increment unread for receiver
                    const currentCount = conversation.unreadCount.get(receiverId.toString()) || 0;
                    conversation.unreadCount.set(receiverId.toString(), currentCount + 1);
                }

                await conversation.save();

                // Emit to conversation room
                io.to(conversationId).emit('chat-message', {
                    message,
                    conversationId
                });

                // Notify receiver to reload conversations/join room if not present
                io.to(receiverId).emit('new-message-notification', {
                    conversationId,
                    senderId
                });

                console.log(`Message sent in room ${conversationId}`);
            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', { message: 'Error al enviar mensaje' });
            }
        });

        socket.on('disconnect', () => {
            console.log('🔌 Client disconnected:', socket.id);
        });
    });

    httpServer.listen(PORT, () => {
        console.log(`=> Servidor de ClickWave corriendo en http://localhost:${PORT}`);
    });
})();
