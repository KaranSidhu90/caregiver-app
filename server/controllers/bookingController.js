const Booking = require('../models/Booking');
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

    const bookings = await Booking.find({ caregiverId, status });

    if (!bookings.length) {
      return res.status(404).json({ message: 'No bookings found for this caregiver' });
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

    const bookings = await Booking.find({ seniorId, status });

    if (!bookings.length) {
      return res.status(200).json([]); 
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

    
    
    

    if (!['Pending', 'Accepted', 'Cancelled'].includes(status)) {
      
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    if (!booking) {
      
      return res.status(404).json({ message: 'Booking not found' });
    }

    
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

    const booking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Determine the user to notify based on who made the change
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

    const booking = await Booking.findByIdAndDelete(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
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

    const cgId = new ObjectId(caregiverId);
    

    const query = { caregiverId: cgId };

    if (status) {
      query.status = status;
    }

    

    const bookings = await Booking.find(query);
    

    if (!bookings.length) {
      
      return res.status(200).json([]); // Return an empty array if no bookings are found
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
