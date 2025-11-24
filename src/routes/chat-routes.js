import express from 'express';
import ChatController from '../controllers/ChatController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

// Render chat view
router.get('/', isAuthenticated, ChatController.renderChatView);

// API routes
router.get('/contacts', isAuthenticated, ChatController.getContacts);
router.get('/conversations', isAuthenticated, ChatController.getConversations);
router.get('/messages/:conversationId', isAuthenticated, ChatController.getMessages);
router.post('/messages', isAuthenticated, ChatController.sendMessage);
router.delete('/conversations/:conversationId', isAuthenticated, ChatController.deleteConversation);

export default router;
