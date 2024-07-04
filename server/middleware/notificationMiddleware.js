const Notification = require('../models/Notification');

const createBookingNotification = async (req, res, next) => {
  try {
    const { userId, bookingId, message, type } = req.notificationData;

    const newNotification = new Notification({ userId, bookingId, message, type });
    await newNotification.save();
    next();
  } catch (err) {
    next(err);
  }
};

const updateBookingNotification = async (req, res, next) => {
  try {
    const { userId, bookingId, message } = req.notificationData;

    const existingNotification = await Notification.findOneAndUpdate(
      { userId, bookingId, type: 'update' },
      { message, date: Date.now(), seen: false },
      { new: true, upsert: true }
    );

    next();
  } catch (err) {
    next(err);
  }
};

const deleteBookingNotification = async (req, res, next) => {
  try {
    const { userId, bookingId } = req.notificationData;

    await Notification.deleteMany({ userId, bookingId, type: 'delete' });

    const newNotification = new Notification({ userId, bookingId, message: 'Booking has been deleted', type: 'delete' });
    await newNotification.save();
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBookingNotification,
  updateBookingNotification,
  deleteBookingNotification
};
