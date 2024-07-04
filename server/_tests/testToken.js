const jwt = require('jsonwebtoken');

// Replace with your secret key from .env
const secretKey = 'key_for_caregiver_app_for_university';

// Create a token
const token = jwt.sign({ id: 'testUserId' }, secretKey, { expiresIn: '1h' });
console.log('Generated Token:', token);

// Verify the token
try {
  const decoded = jwt.verify(token, secretKey);
  console.log('Decoded Token:', decoded);
} catch (err) {
  console.error('Invalid token', err);
}
