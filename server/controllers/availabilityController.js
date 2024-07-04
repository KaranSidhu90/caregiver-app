const Availability = require('../models/Availability');

exports.addOrUpdateAvailability = async (req, res, next) => {
  try {
    const { caregiverId, availability } = req.body;

    // Check if availability for the caregiver already exists
    let existingAvailability = await Availability.findOne({ caregiverId });

    if (existingAvailability) {
      // Update existing availability
      existingAvailability.availability = availability;
      await existingAvailability.save();
      res.status(200).json(existingAvailability);
    } else {
      // Create new availability
      const newAvailability = new Availability({ caregiverId, availability });
      await newAvailability.save();
      res.status(201).json(newAvailability);
    }
  } catch (err) {
    console.error('Error adding or updating availability:', err);
    next(err); // Forward error to the error handler middleware
  }
};

exports.getAvailabilityByCaregiverId = async (req, res, next) => {
  try {
    const { caregiverId } = req.params;
    const availability = await Availability.findOne({ caregiverId });

    if (!availability) {
      return res.status(404).json({ message: 'Caregiver availability not found' });
    }

    res.status(200).json(availability);
  } catch (err) {
    console.error('Error fetching availability:', err);
    next(err); // Forward error to the error handler middleware
  }
};
