const { Schema, model } = require('mongoose');

const conversationSchema = new Schema(
  {
    participants: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }],
    messages: [{
      type: Schema.Types.ObjectId,
      ref: 'Chat',
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const Conversation = model('Conversation', conversationSchema);

module.exports = Conversation;
