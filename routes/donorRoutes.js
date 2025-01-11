const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const donorController = require('../controllers/donorController');

const router = express.Router();

router.use(protect); // Protect all routes
router.use(restrictTo('donor', 'staff')); // Only donors and staff can access

router.post('/donations', donorController.createDonation);
router.get('/donations', donorController.getDonationHistory);
router.get('/eligibility', donorController.checkEligibility);
router.patch('/health-status', donorController.updateHealthStatus);
router.get('/certifications', donorController.getCertifications);
router.post('/certifications', donorController.addCertification);

module.exports = router;