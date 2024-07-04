const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  caregiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  availability: [
    {
      day: {
        type: String,
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
      }
    }
  ]
});

const Availability = mongoose.model('Availability', availabilitySchema);

module.exports = Availability;
