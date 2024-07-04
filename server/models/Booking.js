const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  seniorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  caregiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  slots: {
    morning: {
      type: Boolean,
      default: false
    },
    afternoon: {
      type: Boolean,
      default: false
    },
    evening: {
      type: Boolean,
      default: false
    }
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Cancelled'],
    default: 'Pending'
  },
  additionalInfo: {
    type: String,
    default: 'None'
  },
  location: {
    latitude: Number,
    longitude: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
