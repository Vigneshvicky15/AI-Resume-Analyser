const express = require('express');
const {
  getAdminStats,
  getAllUsers,
  getAllReports,
  deleteUser,
  deleteReport
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply protect & admin middleware to all administrative endpoints
router.use(protect);
router.use(admin);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/reports', getAllReports);
router.delete('/users/:id', deleteUser);
router.delete('/reports/:id', deleteReport);

module.exports = router;
