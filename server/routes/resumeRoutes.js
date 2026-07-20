const express = require('express');
const {
  uploadAndAnalyzeResume,
  getAnalysisHistory,
  getAnalysisById,
  updateAnalysis,
  deleteAnalysis,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Apply protect middleware to all resume endpoints
router.use(protect);

router.post('/upload', upload.single('resume'), uploadAndAnalyzeResume);
router.get('/history', getAnalysisHistory);
router.get('/:id', getAnalysisById);
router.put('/:id', updateAnalysis);
router.delete('/:id', deleteAnalysis);

module.exports = router;
