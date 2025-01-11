const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true
  },
  donationHistory: [{
    date: {
      type: Date,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['completed', 'pending', 'cancelled'],
      default: 'pending'
    }
  }],
  healthStatus: {
    isHealthy: {
      type: Boolean,
      required: true,
      default: true
    },
    notes: String
  },
  certifications: [{
    name: {
      type: String,
      required: true
    },
    issuedBy: {
      type: String,
      required: true
    },
    dateIssued: {
      type: Date,
      required: true
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Donor', donorSchema);