const Donor = require('../models/donorModel');
const Blood = require('../models/bloodModel');

exports.createDonation = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user.id });
    
    if (!donor) {
      return res.status(404).json({
        status: 'fail',
        message: 'Donor profile not found'
      });
    }

    const donation = {
      date: new Date(),
      quantity: req.body.quantity,
      status: 'pending'
    };

    donor.donationHistory.push(donation);
    await donor.save();

    res.status(201).json({
      status: 'success',
      data: {
        donation
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.getDonationHistory = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user.id });
    
    if (!donor) {
      return res.status(404).json({
        status: 'fail',
        message: 'Donor profile not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        donations: donor.donationHistory
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.checkEligibility = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user.id });
    
    if (!donor) {
      return res.status(404).json({
        status: 'fail',
        message: 'Donor profile not found'
      });
    }

    // Check last donation date
    const lastDonation = donor.donationHistory[donor.donationHistory.length - 1];
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const isEligible = !lastDonation || 
                      lastDonation.date < threeMonthsAgo && 
                      donor.healthStatus.isHealthy;

    res.status(200).json({
      status: 'success',
      data: {
        isEligible,
        nextEligibleDate: lastDonation ? new Date(lastDonation.date.getTime() + (90 * 24 * 60 * 60 * 1000)) : new Date()
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.updateHealthStatus = async (req, res) => {
  try {
    const donor = await Donor.findOneAndUpdate(
      { userId: req.user.id },
      { 
        'healthStatus.isHealthy': req.body.isHealthy,
        'healthStatus.notes': req.body.notes 
      },
      { new: true }
    );

    if (!donor) {
      return res.status(404).json({
        status: 'fail',
        message: 'Donor profile not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        healthStatus: donor.healthStatus
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.getCertifications = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user.id });
    
    if (!donor) {
      return res.status(404).json({
        status: 'fail',
        message: 'Donor profile not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        certifications: donor.certifications
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.addCertification = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user.id });
    
    if (!donor) {
      return res.status(404).json({
        status: 'fail',
        message: 'Donor profile not found'
      });
    }

    donor.certifications.push(req.body);
    await donor.save();

    res.status(201).json({
      status: 'success',
      data: {
        certification: req.body
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};