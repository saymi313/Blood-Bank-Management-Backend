const mongoose = require('mongoose');

const recipientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bloodRequests: [{
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true
    },
    status: {
      type: String,
      enum: ['requested', 'fulfilled', 'cancelled'],
      default: 'requested'
    },
    requestDate: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Recipient', recipientSchema);