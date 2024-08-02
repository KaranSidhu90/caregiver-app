const { User, Senior, Caregiver } = require('../models/User');

exports.getAllSeniors = async (req, res, next) => {
  try {
    const seniors = await Senior.find();
    res.json(seniors);
  } catch (err) {
    console.error('Error fetching seniors:', err);
    next(err);
  }
};

exports.getAllCaregivers = async (req, res, next) => {
  try {
    const caregivers = await Caregiver.find();
    res.json(caregivers);
  } catch (err) {
    console.error('Error fetching caregivers:', err);
    next(err);
  }
};

exports.getSeniorById = async (req, res, next) => {
  try {
    const senior = await Senior.findById(req.params.id);
    if (!senior) {
      return res.status(404).json({ message: 'Senior not found' });
    }
    res.json(senior);
  } catch (err) {
    console.error('Error fetching senior by ID:', err);
    next(err);
  }
};

exports.getCaregiverById = async (req, res, next) => {
  try {
    
    const caregiver = await Caregiver.findById(req.params.id);
    if (!caregiver) {
      console.warn('Caregiver not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Caregiver not found' });
    }
    
    res.json(caregiver);
  } catch (err) {
    console.error('Error fetching caregiver by ID:', err);
    next(err);
  }
};

