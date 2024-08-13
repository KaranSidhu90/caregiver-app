const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();
exports.register = async (req, res, next) => {
  try {
    console.log('Request body:', req.body); // Log the request body for debugging

    const {
      name, email, passcode, phoneNumber, gender, dob, addressLine1,
      addressLine2, city, state, zipCode, imageUrl, userType, ailmentCategories, ailments,
      careNeeds, experience, activeClients, totalClients, skills, category
    } = req.body;

    // Check if the passcode is defined
    if (!passcode) {
      return res.status(400).json({ message: 'Passcode is required' });
    }

    // Check if a user with the provided phone number already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already in use' });
    }

    // Hash the passcode
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passcode, salt);
    console.log('Hashed Password:', hashedPassword); // Log the hashed password

    // Transform the careNeeds into an object with boolean values
    const careNeedsData = {
      personalCare: careNeeds === 'personalCare',
      medicalCare: careNeeds === 'medicalCare',
      companionship: careNeeds === 'companionship',
      householdHelp: careNeeds === 'householdHelp',
    };

    // Create new user data
    const newUserData = {
      name, 
      email, 
      password: hashedPassword, 
      phoneNumber, 
      gender, 
      dob, 
      addressLine1,
      addressLine2, 
      city, 
      state, 
      zipCode, 
      imageUrl, 
      userType, 
      ailmentCategories, 
      ailments,
      careNeeds: careNeedsData,  // Use the transformed careNeeds object
      experience, 
      activeClients, 
      totalClients, 
      skills, 
      category
    };
    console.log('New User Data:', newUserData); // Log the user data to be saved

    // Save the new user
    const newUser = new User(newUserData);
    await newUser.save();

    // Generate a token for the new user
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Return the response in the format similar to the login response
    res.status(201).json({
      token,
      email: newUser.email,
      name: newUser.name,
      id: newUser._id,
      userType: newUser.userType
    });
  } catch (err) {
    console.error('Error during registration:', err); // Log the error
    res.status(500).json({ message: 'An unexpected error occurred', error: err.message });
  }
};





exports.login = async (req, res, next) => {
  try {
    const { phoneNumber, passcode } = req.body;
    
    console.log('Login Request:', { phoneNumber, passcode }); // Log the incoming request data

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      console.error('User not found for phone number:', phoneNumber);
      return res.status(400).json({ message: 'Invalid phone number or passcode' });
    }

    console.log('User found:', { id: user._id, name: user.name, phoneNumber: user.phoneNumber }); // Log the found user

    const isMatch = await bcrypt.compare(passcode, user.password); // Assuming passcode is stored as a hashed password
    if (!isMatch) {
      console.error('Passcode does not match for user:', user._id);
      return res.status(400).json({ message: 'Invalid phone number or passcode' });
    }

    console.log('Passcode matched for user:', user._id); // Log when the passcode matches

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    console.log('Generated token for user:', user._id); // Log the token generation

    res.json({ 
      token, 
      email: user.email, 
      name: user.name, 
      id: user._id, 
      userType: user.userType 
    });

    console.log('Login response sent successfully for user:', user._id); // Log the success response

  } catch (err) {
    console.error('Error during login:', err);
    next(err); // Forward error to the error handler middleware
  }
};


