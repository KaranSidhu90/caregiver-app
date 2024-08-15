const Booking = require('../models/Booking');
const User = require('../models/User');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const { createBookingNotification, updateBookingNotification, deleteBookingNotification } = require('../middleware/notificationMiddleware');

exports.createBooking = async (req, res, next) => {
  try {
    const { seniorId, caregiverId, date, slots, location, additionalInfo } = req.body;

    const newBooking = new Booking({
      seniorId,
      caregiverId,
      date,
      slots,
      location,
      additionalInfo
    });

    await newBooking.save();

    req.notificationData = {
      userId: caregiverId,
      bookingId: newBooking._id,
      message: 'A new booking has been created',
      type: 'create'
    };
    await createBookingNotification(req, res, next);

    res.status(201).json(newBooking);
  } catch (err) {
    next(err);
  }
};

exports.getBookingsByCaregiverId = async (req, res, next) => {
  try {
    const { caregiverId } = req.params;
    const { status = "Accepted" } = req.query; 

    if (!ObjectId.isValid(caregiverId)) {
      return res.status(400).json({ message: 'Invalid caregiver ID' });
    }

    const bookings = await Booking.find({ caregiverId, status });
    if (!bookings.length) {
      return res.status(409).json({ message: `No ${status} bookings found for this caregiver` });
    }

    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};

exports.getBookingsBySeniorId = async (req, res, next) => {
  try {
    const { seniorId } = req.params;
    const { status = "Accepted" } = req.query; 

    if (!ObjectId.isValid(seniorId)) {
      return res.status(400).json({ message: 'Invalid senior ID' });
    }

    const bookings = await Booking.find({ seniorId, status });

    if (!bookings.length) {
      return res.status(409).json({ message: 'No bookings found for this senior' });
    }

    res.status(200).json(bookings);
  } catch (err) {
    console.error('Error fetching bookings by senior ID:', err);
    next(err);
  }
};

exports.changeBookingStatus = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.query;

    if (!['Pending', 'Accepted', 'Cancelled', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    if (!ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(409).json({ message: 'Booking not found' });
    }

    req.notificationData = {
      userId: booking.caregiverId,
      bookingId: booking._id,
      message: `Booking status changed to ${status}`,
      type: 'update'
    };
    await updateBookingNotification(req, res, next);

    res.status(200).json(booking);
  } catch (err) {
    console.error('Error updating booking status:', err);
    next(err);
  }
};

exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    const booking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true });

    if (!booking) {
      return res.status(409).json({ message: 'Booking not found' });
    }

    const userToNotify = req.user.id === booking.seniorId.toString() ? booking.caregiverId : booking.seniorId;

    req.notificationData = {
      userId: userToNotify,
      bookingId: booking._id,
      message: 'Booking status has been updated',
      type: 'update'
    };
    await updateBookingNotification(req, res, next);

    res.status(200).json(booking);
  } catch (err) {
    next(err);
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    if (!ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    const booking = await Booking.findByIdAndDelete(bookingId);

    if (!booking) {
      return res.status(409).json({ message: 'Booking not found' });
    }

    req.notificationData = {
      userId: booking.caregiverId,
      bookingId: booking._id,
      message: 'Booking has been deleted',
      type: 'delete'
    };
    await deleteBookingNotification(req, res, next);

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (err) {
    next(err);
  }
};

exports.getBookingSlotsByCaregiverId = async (req, res, next) => {
  try {
    const { caregiverId, status } = req.params;

    if (!ObjectId.isValid(caregiverId)) {
      return res.status(400).json({ message: 'Invalid caregiver ID' });
    }

    const query = { caregiverId: new ObjectId(caregiverId) };

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query);

    if (!bookings.length) {
      return res.status(409).json({ message: 'No bookings found for this caregiver' });
    }

    const slotsByDate = {};

    bookings.forEach(booking => {
      const date = booking.date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
      if (!slotsByDate[date]) {
        slotsByDate[date] = {
          caregiverId,
          date,
          morning: false,
          afternoon: false,
          evening: false,
          isFullyBooked: false
        };
      }

      slotsByDate[date].morning = slotsByDate[date].morning || booking.slots.morning;
      slotsByDate[date].afternoon = slotsByDate[date].afternoon || booking.slots.afternoon;
      slotsByDate[date].evening = slotsByDate[date].evening || booking.slots.evening;
      slotsByDate[date].isFullyBooked = slotsByDate[date].morning && slotsByDate[date].afternoon && slotsByDate[date].evening;
    });

    const result = Object.values(slotsByDate);
    
    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching booking slots by caregiver ID:', err);
    res.status(500).json({ message: 'An unexpected error occurred', error: err.message });
  }
};

exports.getBookingBasicDetailsByCaregiverId = async (req, res, next) => {
  try {
    const { caregiverId } = req.params;
    const { status = "Pending" } = req.query;

    if (!ObjectId.isValid(caregiverId)) {
      return res.status(400).json({ message: 'Invalid caregiver ID' });
    }

    const bookings = await Booking.find({ caregiverId, status });

    if (!bookings.length) {
      return res.status(409).json({ message: `No ${status} bookings found for this caregiver` });
    }

    const detailedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const senior = await User.Senior.findById(booking.seniorId, {
          name: 1,
          phoneNumber: 1,
          status: 1,
          gender: 1,
          careNeeds: 1,
          ailmentCategories: 1,
          ailments: 1,
          imageUrl: 1,
          addressLine1: 1,
          addressLine2: 1,
          city: 1,
          state: 1,
          zipCode: 1,
          dob:1
        });

        if (senior) {
          // Filter careNeeds to include only true values
          const careNeeds = Object.keys(senior.careNeeds || {}).filter(
            (key) => senior.careNeeds[key]
          );

          return {
            ...booking.toObject(),
            seniorDetails: {
              ...senior.toObject(),
              careNeeds,
            },
          };
        }
        return {
          ...booking.toObject(),
          seniorDetails: null,
        };
      })
    );

    res.status(200).json(detailedBookings);
  } catch (err) {
    console.error('Error fetching booking details:', err);
    next(err);
  }
};


exports.getRemainingTrialVisits = async (req, res, next) => {
  try {
    const { seniorId } = req.params;

    if (!ObjectId.isValid(seniorId)) {
      return res.status(400).json({ message: 'Invalid senior ID' });
    }

    const bookingCount = await Booking.countDocuments({
      seniorId,
      status: { $in: ['Accepted', 'Completed'] }
    });

    const remainingVisits = Math.max(7 - bookingCount, 0);

    res.status(200).json({ remainingVisits });
  } catch (err) {
    console.error('Error fetching remaining trial visits:', err);
    next(err);
  }
};
