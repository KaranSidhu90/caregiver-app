const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const availabilityController = require('../controllers/availabilityController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Availability:
 *       type: object
 *       required:
 *         - caregiverId
 *         - availability
 *       properties:
 *         caregiverId:
 *           type: string
 *           description: The ID of the caregiver
 *         availability:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               day:
 *                 type: string
 *                 description: The day of the week
 *               slots:
 *                 type: object
 *                 properties:
 *                   morning:
 *                     type: boolean
 *                   afternoon:
 *                     type: boolean
 *                   evening:
 *                     type: boolean
 *       example:
 *         caregiverId: 66860a2ab778421280d0d8a4
 *         availability: 
 *           - day: Sunday
 *             slots: 
 *               morning: true
 *               afternoon: true
 *               evening: true
 */

/**
 * @swagger
 * tags:
 *   name: Availability
 *   description: Caregiver availability management
 */

/**
 * @swagger
 * /availability:
 *   post:
 *     summary: Add or update caregiver availability
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Availability'
 *     responses:
 *       201:
 *         description: Availability added or updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Availability'
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
router.post('/', authMiddleware, availabilityController.addOrUpdateAvailability);

/**
 * @swagger
 * /availability/{caregiverId}:
 *   get:
 *     summary: Get caregiver availability by caregiverId
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: caregiverId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the caregiver
 *     responses:
 *       200:
 *         description: Caregiver availability data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Availability'
 *       404:
 *         description: Caregiver availability not found
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
router.get('/:caregiverId', authMiddleware, availabilityController.getAvailabilityByCaregiverId);

module.exports = router;
