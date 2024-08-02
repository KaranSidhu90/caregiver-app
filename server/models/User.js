const mongoose = require('mongoose');

const options = { discriminatorKey: 'userType', collection: 'users' };

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  gender: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  addressLine1: {
    type: String,
    required: true
  },
  addressLine2: {
    type: String
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  userType: {
    type: String,
    required: true,
    enum: ['Senior', 'Caregiver']
  }
}, options);

const User = mongoose.model('User', UserSchema);

const SeniorSchema = new mongoose.Schema({
  ailmentCategories: {
    type: [String]
  },
  ailments: {
    type: [String]
  },
  careNeeds: {
    personalCare: {
      type: Boolean,
      default: false
    },
    medicalCare: {
      type: Boolean,
      default: false
    },
    companionship: {
      type: Boolean,
      default: false
    },
    householdHelp: {
      type: Boolean,
      default: false
    }
  }
});

const CaregiverSchema = new mongoose.Schema({
  experience: {
    type: String
  },
  activeClients: {
    type: Number
  },
  totalClients: {
    type: Number
  },
  skills: {
    type: [String]
  },
  category: {
    type: String,
  }
});

const Senior = User.discriminator('Senior', SeniorSchema);
const Caregiver = User.discriminator('Caregiver', CaregiverSchema);

module.exports = { User, Senior, Caregiver };
