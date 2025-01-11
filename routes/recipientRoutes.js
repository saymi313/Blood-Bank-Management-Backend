const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const recipientController = require('../controllers/recipientController');

const router = express.Router();

router.use(protect);
router.use(restrictTo('recipient', 'staff'));

router.post('/requests', recipientController.createRequest);
router.get('/requests', recipientController.getRequestHistory);
router.patch('/requests/:id', recipientController.updateRequest);
router.delete('/requests/:id', recipientController.cancelRequest);

module.exports = router;