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
      careNeeds, experience, activeClients, totalClients, skills
    } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name, email, password: hashedPassword, phoneNumber, gender, dob, addressLine1,
      addressLine2, city, state, zipCode, imageUrl, userType, ailmentCategories, ailments,
      careNeeds, experience, activeClients, totalClients, skills
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error during registration:', err);
    next(err); // Forward error to the error handler middleware
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('Login request:', email, password);
    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found');
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error('Password does not match');
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    console.log('Generated token:', token);
    res.json({ token });
  } catch (err) {
    console.error('Error during login:', err);
    next(err); // Forward error to the error handler middleware
  }
};
