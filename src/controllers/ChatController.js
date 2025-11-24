import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import User from '../models/UserModel.js';

class ChatController {
    // Render chat view
    static renderChatView(req, res) {
        res.render('chat', {
            title: 'Chat Interno',
            user: req.user
        });
    }

    // Get all available contacts (all users except current user)
    static async getContacts(req, res) {
        try {
            const currentUserId = req.user._id;

            // Get users and manually populate employee data
            const users = await User.model.find({
                _id: { $ne: currentUserId },
                is_active: true
            })
                .select('username email')
                .sort({ username: 1 })
                .lean();

            // Get employee data for all users
            const Employee = (await import('../models/EmployeeModel.js')).default;

            const contacts = await Promise.all(users.map(async (user) => {
                let displayName = user.username;
                let isEmployee = false;

                // Try to find employee data for this user
                const employee = await Employee.model.findOne({ user_id: user._id })
                    .select('first_name last_name')
                    .lean();

                // If user has employee data, use first_name and last_name
                if (employee && employee.first_name && employee.last_name) {
                    displayName = `${employee.first_name} ${employee.last_name}`;
                    isEmployee = true;
                }

                return {
                    _id: user._id,
                    username: user.username,
                    displayName: displayName,
                    email: user.email || '',
                    isEmployee: isEmployee
                };
            }));

            res.json({ success: true, contacts });
        } catch (error) {
            console.error('Error fetching contacts:', error);
            res.status(500).json({ success: false, message: 'Error al cargar contactos' });
        }
    }

    // Get active conversations for current user
    static async getConversations(req, res) {
        try {
            const currentUserId = req.user._id;

            const conversations = await Conversation.find({
                participants: currentUserId
            })
                .populate('participants', 'username email')
                .sort({ lastMessageTime: -1 });

            const Employee = (await import('../models/EmployeeModel.js')).default;

            // Format conversations for frontend
            const formattedConversations = await Promise.all(conversations.map(async (conv) => {
                const otherUser = conv.participants.find(
                    p => p._id.toString() !== currentUserId.toString()
                );

                if (!otherUser) return null;

                let displayName = otherUser.username;

                // Try to find employee data for this user
                const employee = await Employee.model.findOne({ user_id: otherUser._id })
                    .select('first_name last_name')
                    .lean();

                if (employee && employee.first_name && employee.last_name) {
                    displayName = `${employee.first_name} ${employee.last_name}`;
                }

                return {
                    conversationId: conv.conversationId,
                    contact: {
                        _id: otherUser._id,
                        username: otherUser.username,
                        displayName: displayName,
                        email: otherUser.email
                    },
                    lastMessage: conv.lastMessage,
                    lastMessageTime: conv.lastMessageTime,
                    unreadCount: conv.unreadCount.get(currentUserId.toString()) || 0
                };
            }));

            // Filter out nulls (in case otherUser wasn't found)
            const validConversations = formattedConversations.filter(c => c !== null);

            res.json({ success: true, conversations: validConversations });
        } catch (error) {
            console.error('Error fetching conversations:', error);
            res.status(500).json({ success: false, message: 'Error al cargar conversaciones' });
        }
    }

    // Get messages for a specific conversation
    static async getMessages(req, res) {
        try {
            const { conversationId } = req.params;
            const currentUserId = req.user._id;

            // Verify user is part of this conversation
            const conversation = await Conversation.findOne({
                conversationId,
                participants: currentUserId
            });

            if (!conversation) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes acceso a esta conversación'
                });
            }

            // Get messages
            const messages = await Message.find({ conversationId })
                .populate('sender', 'username')
                .populate('receiver', 'username')
                .sort({ timestamp: 1 });

            // Mark messages as read
            await Message.updateMany(
                {
                    conversationId,
                    receiver: currentUserId,
                    read: false
                },
                { read: true }
            );

            // Reset unread count
            await conversation.resetUnread(currentUserId);

            res.json({ success: true, messages });
        } catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ success: false, message: 'Error al cargar mensajes' });
        }
    }

    // Send a message
    static async sendMessage(req, res) {
        try {
            const { receiverId, text } = req.body;
            const senderId = req.user._id;

            if (!receiverId || !text) {
                return res.status(400).json({
                    success: false,
                    message: 'Faltan datos requeridos'
                });
            }

            // Generate conversation ID
            const conversationId = Message.generateConversationId(senderId, receiverId);

            // Create message
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
                await conversation.incrementUnread(receiverId);
            }

            await conversation.save();

            res.json({ success: true, message });
        } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).json({ success: false, message: 'Error al enviar mensaje' });
        }
    }

    // Delete a conversation
    static async deleteConversation(req, res) {
        try {
            const { conversationId } = req.params;
            const currentUserId = req.user._id;

            // Verify user is part of this conversation
            const conversation = await Conversation.findOne({
                conversationId,
                participants: currentUserId
            });

            if (!conversation) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes acceso a esta conversación'
                });
            }

            // Delete all messages in this conversation
            await Message.deleteMany({ conversationId });

            // Delete conversation
            await Conversation.deleteOne({ conversationId });

            res.json({ success: true, message: 'Conversación eliminada' });
        } catch (error) {
            console.error('Error deleting conversation:', error);
            res.status(500).json({ success: false, message: 'Error al eliminar conversación' });
        }
    }
}

export default ChatController;
