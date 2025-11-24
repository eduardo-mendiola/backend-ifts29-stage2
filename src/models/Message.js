import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    conversationId: {
        type: String,
        required: true,
        index: true
    },
    read: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
});

// Index for efficient querying
messageSchema.index({ conversationId: 1, timestamp: -1 });
messageSchema.index({ sender: 1, receiver: 1 });

// Static method to generate conversation ID
messageSchema.statics.generateConversationId = function (userId1, userId2) {
    // Sort IDs to ensure consistency
    const ids = [userId1.toString(), userId2.toString()].sort();
    return `${ids[0]}_${ids[1]}`;
};

const Message = mongoose.model('Message', messageSchema);

export default Message;
