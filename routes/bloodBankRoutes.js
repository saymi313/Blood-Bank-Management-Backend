const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const bloodBankController = require('../controllers/bloodBankController');

const router = express.Router();

router.use(protect);
router.use(restrictTo('staff')); // Only staff can access blood bank management

router.get('/inventory', bloodBankController.getInventory);
router.post('/inventory', bloodBankController.addToInventory);
router.patch('/inventory/:id', bloodBankController.updateBloodStatus);
router.get('/requests', bloodBankController.getAllRequests);
router.patch('/requests/:id', bloodBankController.processRequest);

module.exports = router;