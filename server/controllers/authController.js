const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();
exports.register = async (req, res, next) => {
  try {
    const {
      name, email, password, phoneNumber, gender, dob, addressLine1,
      addressLine2, city, state, zipCode, imageUrl, userType, ailmentCategories, ailments,
      careNeeds, experience, activeClients, totalClients, skills, category
    } = req.body;

    // Check if a user with the provided phone number already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUserData = {
      name, email, password: hashedPassword, phoneNumber, gender, dob, addressLine1,
      addressLine2, city, state, zipCode, imageUrl, userType, ailmentCategories, ailments,
      careNeeds, experience, activeClients, totalClients, skills, category
    };

    const newUser = new User(newUserData);

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error during registration:', err);
    next(err); 
  }
};




exports.login = async (req, res, next) => {
  try {
    const { phoneNumber, passcode } = req.body;
    

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      console.error('User not found');
      return res.status(400).json({ message: 'Invalid phone number or passcode' });
    }

    const isMatch = await bcrypt.compare(passcode, user.password); // Assuming passcode is stored as a hashed password
    if (!isMatch) {
      console.error('Passcode does not match');
      return res.status(400).json({ message: 'Invalid phone number or passcode' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    
    res.json({ token, email: user.email, name: user.name, id: user._id });
  } catch (err) {
    console.error('Error during login:', err);
    next(err); // Forward error to the error handler middleware
  }
};


