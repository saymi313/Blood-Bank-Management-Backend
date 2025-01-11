const Recipient = require('../models/recipientModel');
const Blood = require('../models/bloodModel');

exports.createRequest = async (req, res) => {
  try {
    const recipient = await Recipient.findOne({ userId: req.user.id });
    
    if (!recipient) {
      return res.status(404).json({
        status: 'fail',
        message: 'Recipient profile not found'
      });
    }

    const bloodRequest = {
      bloodGroup: req.body.bloodGroup,
      quantity: req.body.quantity,
      urgency: req.body.urgency,
      requestDate: new Date()
    };

    recipient.bloodRequests.push(bloodRequest);
    await recipient.save();

    res.status(201).json({
      status: 'success',
      data: {
        request: bloodRequest
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.getRequestHistory = async (req, res) => {
  try {
    const recipient = await Recipient.findOne({ userId: req.user.id });
    
    if (!recipient) {
      return res.status(404).json({
        status: 'fail',
        message: 'Recipient profile not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        requests: recipient.bloodRequests
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.updateRequest = async (req, res) => {
  try {
    const recipient = await Recipient.findOne({ userId: req.user.id });
    
    if (!recipient) {
      return res.status(404).json({
        status: 'fail',
        message: 'Recipient profile not found'
      });
    }

    const request = recipient.bloodRequests.id(req.params.id);
    if (!request) {
      return res.status(404).json({
        status: 'fail',
        message: 'Request not found'
      });
    }

    if (request.status === 'fulfilled') {
      return res.status(400).json({
        status: 'fail',
        message: 'Cannot update fulfilled request'
      });
    }

    Object.assign(request, req.body);
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

exports.cancelRequest = async (req, res) => {
  try {
    const recipient = await Recipient.findOne({ userId: req.user.id });
    
    if (!recipient) {
      return res.status(404).json({
        status: 'fail',
        message: 'Recipient profile not found'
      });
    }

    const request = recipient.bloodRequests.id(req.params.id);
    if (!request) {
      return res.status(404).json({
        status: 'fail',
        message: 'Request not found'
      });
    }

    if (request.status === 'fulfilled') {
      return res.status(400).json({
        status: 'fail',
        message: 'Cannot cancel fulfilled request'
      });
    }

    request.status = 'cancelled';
    await recipient.save();

    res.status(200).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};