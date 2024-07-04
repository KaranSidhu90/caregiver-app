const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const reviewController = require('../controllers/reviewController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - reviewerId
 *         - receiverId
 *         - rating
 *         - comment
 *       properties:
 *         reviewerId:
 *           type: string
 *           description: The ID of the reviewer (senior or caregiver)
 *         receiverId:
 *           type: string
 *           description: The ID of the receiver (senior or caregiver)
 *         rating:
 *           type: number
 *           description: The rating given by the reviewer
 *           minimum: 1
 *           maximum: 5
 *         comment:
 *           type: string
 *           description: The review comment
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date the review was created
 *       example:
 *         reviewerId: 66860a2ab778421280d0d8a4
 *         receiverId: 66860a2ab778421280d0d8a5
 *         rating: 5
 *         comment: "Excellent caregiver, highly recommended!"
 */

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Add a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Review added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
router.post('/', authMiddleware, reviewController.addReview);

/**
 * @swagger
 * /reviews/{receiverId}:
 *   get:
 *     summary: Get reviews for a user
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: receiverId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user receiving the reviews
 *     responses:
 *       200:
 *         description: Reviews fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       404:
 *         description: User not found
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
router.get('/:receiverId', authMiddleware, reviewController.getReviewsByReceiverId);

module.exports = router;
