const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Auth:
 *       type: object
 *       required:
 *         - phoneNumber
 *         - passcode
 *       properties:
 *         phoneNumber:
 *           type: string
 *           description: The user's phone number
 *         passcode:
 *           type: string
 *           description: The user's passcode
 *       example:
 *         phoneNumber: "+11231231234"
 *         passcode: "1234"
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - phoneNumber
 *         - gender
 *         - dob
 *         - addressLine1
 *         - city
 *         - state
 *         - zipCode
 *         - userType
 *       properties:
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 *         phoneNumber:
 *           type: string
 *           description: The user's phone number
 *         gender:
 *           type: string
 *           description: The user's gender
 *         dob:
 *           type: string
 *           format: date
 *           description: The user's date of birth
 *         addressLine1:
 *           type: string
 *           description: The user's address line 1
 *         addressLine2:
 *           type: string
 *           description: The user's address line 2
 *         city:
 *           type: string
 *           description: The user's city
 *         state:
 *           type: string
 *           description: The user's state
 *         zipCode:
 *           type: string
 *           description: The user's zip code
 *         imageUrl:
 *           type: string
 *           description: The user's profile image URL
 *         userType:
 *           type: string
 *           enum: [Senior, Caregiver]
 *           description: The type of user
 *         ailmentCategories:
 *           type: array
 *           items:
 *             type: string
 *           description: The senior's ailment categories
 *         ailments:
 *           type: array
 *           items:
 *             type: string
 *           description: The senior's ailments
 *         careNeeds:
 *           type: object
 *           properties:
 *             personalCare:
 *               type: boolean
 *             medicalCare:
 *               type: boolean
 *             companionship:
 *               type: boolean
 *             householdHelp:
 *               type: boolean
 *           description: The senior's care needs
 *         experience:
 *           type: string
 *           description: The caregiver's experience
 *         activeClients:
 *           type: number
 *           description: The number of active clients the caregiver has
 *         totalClients:
 *           type: number
 *           description: The total number of clients the caregiver has had
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *           description: The caregiver's skills
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: 60d21b4667d0d8992e610c85
 *               name: John Doe
 *               email: john@example.com
 *               userType: Caregiver
 *               phoneNumber: "123-456-7890"
 *               dob: "1990-01-01"
 *               addressLine1: "123 Main St"
 *               addressLine2: "Apt 4B"
 *               city: "Anytown"
 *               state: "CA"
 *               zipCode: "12345"
 *               imageUrl: "http://example.com/image.jpg"
 *               experience: "5 years"
 *               activeClients: 3
 *               totalClients: 10
 *               skills: ["CPR", "First Aid"]
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 id:
 *                   type: string
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               email: "john@example.com"
 *               name: "John Doe"
 *               id: "60d21b4667d0d8992e610c85"
 *       400:
 *         description: Invalid phone number or passcode
 *         content:
 *           application/json:
 *             example:
 *               message: Invalid phone number or passcode
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
router.post('/login', authController.login);

module.exports = router;
