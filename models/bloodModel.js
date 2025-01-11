const mongoose = require('mongoose');

const bloodSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true
  },
  quantityAvailable: {
    type: Number,
    required: true,
    min: 0
  },
  expiryDate: {
    type: Date,
    required: true
  },
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'used', 'expired', 'quarantined'],
    required: true,
    default: 'available'
  },
  storageLocation: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Blood', bloodSchema);