const Blood = require('../models/bloodModel');
const Recipient = require('../models/recipientModel');

exports.getInventory = async (req, res) => {
  try {
    const inventory = await Blood.find().populate('donorId');
    
    res.status(200).json({
      status: 'success',
      data: {
        inventory
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.addToInventory = async (req, res) => {
  try {
    const blood = await Blood.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        blood
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.updateBloodStatus = async (req, res) => {
  try {
    const blood = await Blood.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!blood) {
      return res.status(404).json({
        status: 'fail',
        message: 'Blood unit not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        blood
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const recipients = await Recipient.find().populate('userId');
    const requests = recipients.reduce((acc, recipient) => {
      return [...acc, ...recipient.bloodRequests.map(request => ({
        ...request.toObject(),
        recipient: {
          id: recipient.userId._id,
          name: recipient.userId.name,
          email: recipient.userId.email
        }
      }))];
    }, []);

    res.status(200).json({
      status: 'success',
      data: {
        requests
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.processRequest = async (req, res) => {
  try {
    const recipient = await Recipient.findOne({
      'bloodRequests._id': req.params.id
    });

    if (!recipient) {
      return res.status(404).json({
        status: 'fail',
        message: 'Request not found'
      });
    }

    const request = recipient.bloodRequests.id(req.params.id);
    if (!request) {
      return res.status(404).json({
        status: 'fail',
        message: 'Request not found'
      });
    }

    // Check blood availability
    const availableBlood = await Blood.findOne({
      type: request.bloodGroup,
      status: 'available',
      quantityAvailable: { $gte: request.quantity }
    });

    if (!availableBlood) {
      return res.status(400).json({
        status: 'fail',
        message: 'Required blood type not available in sufficient quantity'
      });
    }

    // Update blood inventory
    availableBlood.quantityAvailable -= request.quantity;
    if (availableBlood.quantityAvailable === 0) {
      availableBlood.status = 'used';
    }
    await availableBlood.save();

    // Update request status
    request.status = 'fulfilled';
    await recipient.save();

    res.status(200).json({
      status: 'success',
      data: {
        request
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};