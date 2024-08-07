const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const bookingController = require('../controllers/bookingController');

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - seniorId
 *         - caregiverId
 *         - date
 *         - slots
 *       properties:
 *         seniorId:
 *           type: string
 *           description: ID of the senior user
 *         caregiverId:
 *           type: string
 *           description: ID of the caregiver user
 *         date:
 *           type: string
 *           format: date
 *           description: Date of the booking
 *         slots:
 *           type: object
 *           properties:
 *             morning:
 *               type: boolean
 *             afternoon:
 *               type: boolean
 *             evening:
 *               type: boolean
 *           description: Slots for the booking
 *         location:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *             longitude:
 *               type: number
 *           description: Location of the booking
 *         additionalInfo:
 *           type: string
 *           description: Additional information for the booking
 *       example:
 *         seniorId: "60c72b2f9b1d4c3f2c7e25a8"
 *         caregiverId: "60c72b319b1d4c3f2c7e25a9"
 *         date: "2023-07-10"
 *         slots:
 *           morning: true
 *           afternoon: false
 *           evening: true
 *         location:
 *           latitude: 50.4501
 *           longitude: 30.5234
 *         additionalInfo: "Special instructions for the caregiver"
 */

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *             example:
 *               seniorId: "60c72b2f9b1d4c3f2c7e25a8"
 *               caregiverId: "60c72b319b1d4c3f2c7e25a9"
 *               date: "2023-07-10"
 *               slots:
 *                 morning: true
 *                 afternoon: false
 *                 evening: true
 *               location:
 *                 latitude: 50.4501
 *                 longitude: 30.5234
 *               additionalInfo: "Special instructions for the caregiver"
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
 */
router.post('/', authMiddleware, bookingController.createBooking);

/**
 * @swagger
 * /bookings/caregiver/{caregiverId}:
 *   get:
 *     summary: Get all bookings for a caregiver
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: caregiverId
 *         required: true
 *         schema:
 *           type: string
 *         description: The caregiver ID
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Pending, Accepted, Cancelled, Completed]
 *         description: The booking status
 *     responses:
 *       200:
 *         description: List of bookings for the caregiver
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *             example:
 *               - seniorId: "60c72b2f9b1d4c3f2c7e25a8"
 *                 caregiverId: "60c72b319b1d4c3f2c7e25a9"
 *                 date: "2023-07-10"
 *                 slots:
 *                   morning: true
 *                   afternoon: false
 *                   evening: true
 *                 location:
 *                   latitude: 50.4501
 *                   longitude: 30.5234
 *                 additionalInfo: "Special instructions for the caregiver"
 *       404:
 *         description: No bookings found
 *         content:
 *           application/json:
 *             example:
 *               message: "No bookings found for this caregiver"
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
 */
router.get('/caregiver/:caregiverId', authMiddleware, bookingController.getBookingsByCaregiverId);

/**
 * @swagger
 * /bookings/senior/{seniorId}:
 *   get:
 *     summary: Get all bookings for a senior
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: seniorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The senior ID
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Pending, Accepted, Cancelled, Completed]
 *         description: The booking status
 *     responses:
 *       200:
 *         description: List of bookings for the senior
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *             example:
 *               - seniorId: "60c72b2f9b1d4c3f2c7e25a8"
 *                 caregiverId: "60c72b319b1d4c3f2c7e25a9"
 *                 date: "2023-07-10"
 *                 slots:
 *                   morning: true
 *                   afternoon: false
 *                   evening: true
 *                 location:
 *                   latitude: 50.4501
 *                   longitude: 30.5234
 *                 additionalInfo: "Special instructions for the caregiver"
 *       404:
 *         description: No bookings found
 *         content:
 *           application/json:
 *             example:
 *               message: "No bookings found for this senior"
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
 */
router.get('/senior/:seniorId', authMiddleware, bookingController.getBookingsBySeniorId);


/**
 * @swagger
 * /bookings/changeStatus/{bookingId}:
 *   patch:
 *     summary: Change the status of a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The booking ID
 *       - in: query
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Pending, Accepted, Cancelled, Completed]
 *         description: The new status for the booking
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *             example:
 *               seniorId: "60c72b2f9b1d4c3f2c7e25a8"
 *               caregiverId: "60c72b319b1d4c3f2c7e25a9"
 *               date: "2023-07-10"
 *               slots:
 *                 morning: true
 *                 afternoon: false
 *                 evening: true
 *               location:
 *                 latitude: 50.4501
 *                 longitude: 30.5234
 *               additionalInfo: "Special instructions for the caregiver"
 *               status: "Accepted"
 *       400:
 *         description: Invalid status
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid status"
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Booking not found"
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
 */
router.patch('/changeStatus/:bookingId', authMiddleware, bookingController.changeBookingStatus);



``
/**
 * @swagger
 * /bookings/{bookingId}:
 *   put:
 *     summary: Update booking status
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Accepted, Cancelled, Completed]
 *             example:
 *               status: "Accepted"
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *             example:
 *               seniorId: "60c72b2f9b1d4c3f2c7e25a8"
 *               caregiverId: "60c72b319b1d4c3f2c7e25a9"
 *               date: "2023-07-10"
 *               slots:
 *                 morning: true
 *                 afternoon: false
 *                 evening: true
 *               location:
 *                 latitude: 50.4501
 *                 longitude: 30.5234
 *               additionalInfo: "Special instructions for the caregiver"
 *               status: "Accepted"
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Booking not found"
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
 */
router.put('/:bookingId', authMiddleware, bookingController.updateBookingStatus);

/**
 * @swagger
 * /bookings/{bookingId}:
 *   delete:
 *     summary: Delete a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The booking ID
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *             example:
 *               message: "Booking deleted successfully"
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Booking not found"
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
 */
router.delete('/:bookingId', authMiddleware, bookingController.deleteBooking);

/**
 * @swagger
 * /bookings/caregiver/slots/{caregiverId}/{status}:
 *   get:
 *     summary: Get booking slots for a caregiver by status
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: caregiverId
 *         required: true
 *         schema:
 *           type: string
 *         description: The caregiver ID
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Pending, Accepted, Cancelled, Completed]
 *         description: The booking status
 *     responses:
 *       200:
 *         description: List of booking slots for the caregiver
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   caregiverId:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *                   morning:
 *                     type: boolean
 *                   afternoon:
 *                     type: boolean
 *                   evening:
 *                     type: boolean
 *                   isFullyBooked:
 *                     type: boolean
 *                 example:
 *                   caregiverId: "60c72b319b1d4c3f2c7e25a9"
 *                   date: "2023-07-10"
 *                   morning: true
 *                   afternoon: false
 *                   evening: true
 *                   isFullyBooked: false
 *       400:
 *         description: Invalid caregiver ID
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid caregiver ID"
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
 */

router.get('/caregiver/slots/:caregiverId/:status', authMiddleware, bookingController.getBookingSlotsByCaregiverId);




module.exports = router;
