const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

/**
 * @swagger
 * components:
 *   schemas:
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
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/users/seniors:
 *   get:
 *     summary: Get all seniors
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of seniors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
router.get('/seniors', authMiddleware, userController.getAllSeniors);

/**
 * @swagger
 * /api/users/caregivers:
 *   get:
 *     summary: Get all caregivers
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of caregivers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
router.get('/caregivers', authMiddleware, userController.getAllCaregivers);

/**
 * @swagger
 * /api/users/seniors/{id}:
 *   get:
 *     summary: Get senior by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The senior user ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Senior details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Senior not found
 *       500:
 *         description: Some server error
 */
router.get('/seniors/:id', authMiddleware, userController.getSeniorById);

/**
 * @swagger
 * /api/users/caregivers/{id}:
 *   get:
 *     summary: Get caregiver by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The caregiver user ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Caregiver details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Caregiver not found
 *       500:
 *         description: Some server error
 */
router.get('/caregivers/:id', authMiddleware, userController.getCaregiverById);

module.exports = router;
