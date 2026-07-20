const fs = require('fs');
const path = require('path');
const Analysis = require('../models/Analysis');
const { extractTextFromPDF } = require('../utils/pdfExtract');
const { analyzeResumeWithClaude } = require('../utils/claudeAI');
const cloudinary = require('../config/cloudinary');

/**
 * Helper to upload file buffer directly to Cloudinary.
 * Since it is a PDF, we upload it as a raw asset, explicitly requesting PDF formatting.
 */
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'ai_resumes',
        resource_type: 'auto', // Auto-detect PDF as viewable document
        public_id: `resume_${Date.now()}`,
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary] Upload failed:', error.message);
          return reject(new Error('Cloudinary upload failed: ' + error.message));
        }
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// @desc    Upload, parse, analyze resume with Claude AI, and save results
// @route   POST /api/resume/upload
// @access  Private
const uploadAndAnalyzeResume = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a resume file (PDF)');
    }

    const { jobDescription } = req.body;

    console.log(`[Resume Controller] Starting analysis for user: ${req.user._id}`);
    
    // Save PDF locally for guaranteed inline browser tab previews
    console.log('[Resume Controller] Saving PDF copy locally...');
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const fileName = `resume_${Date.now()}.pdf`;
    const localFilePath = path.join(uploadDir, fileName);
    fs.writeFileSync(localFilePath, req.file.buffer);

    // PDF URL - Default to local uploads copy
    let resumeUrl = `${req.protocol}://${req.get('host')}/uploads/${fileName}`;
    console.log('[Resume Controller] PDF saved locally. URL:', resumeUrl);

    // Upload to Cloudinary (Bypasses errors and falls back to local URL if Cloudinary is not configured)
    try {
      console.log('[Resume Controller] Uploading to Cloudinary...');
      const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      if (cloudinaryResult && cloudinaryResult.secure_url) {
        resumeUrl = cloudinaryResult.secure_url;
        console.log('[Resume Controller] Cloudinary upload successful. URL:', resumeUrl);
      }
    } catch (clError) {
      console.warn('[Resume Controller] Cloudinary upload failed (falling back to local URL):', clError.message);
    }

    // Step 3 & 4: Extract text using pdf-parse and clean it
    console.log('[Resume Controller] Extracting text from PDF...');
    const extractedText = await extractTextFromPDF(req.file.buffer);
    
    if (!extractedText || extractedText.length < 50) {
      res.status(400);
      throw new Error('The uploaded PDF does not contain enough extractable text. Please ensure it is not an image-only scanned document.');
    }
    console.log(`[Resume Controller] Text extracted successfully. Length: ${extractedText.length} characters.`);

    // Step 5 & 6: Query Claude AI for structural JSON feedback
    console.log('[Resume Controller] Sending prompt to Claude AI...');
    const analysisResult = await analyzeResumeWithClaude(extractedText, jobDescription);
    console.log('[Resume Controller] Claude AI analysis completed successfully.');

    // Step 7: Save result to MongoDB
    console.log('[Resume Controller] Saving analysis to MongoDB...');
    const analysis = await Analysis.create({
      user: req.user._id,
      resumeUrl,
      score: analysisResult.score,
      strengths: analysisResult.strengths,
      weaknesses: analysisResult.weaknesses,
      skillGaps: analysisResult.skillGaps,
      suggestions: analysisResult.suggestions,
      jobMatchPercentage: analysisResult.jobMatchPercentage,
      jobDescription: jobDescription || '',
      // Newly added dynamic properties
      domain: analysisResult.domain || 'General Professional',
      experienceLevel: analysisResult.experienceLevel || 'Mid Level',
      matchedSkills: analysisResult.matchedSkills || [],
      missingSkills: analysisResult.missingSkills || [],
      skillsMatchPercentage: analysisResult.skillsMatchPercentage || 0,
      optimizedBullets: analysisResult.optimizedBullets || [],
      domainVerbs: analysisResult.domainVerbs || [],
      domainMetrics: analysisResult.domainMetrics || [],
      formattingTips: analysisResult.formattingTips || [],
      experienceAdvice: analysisResult.experienceAdvice || [],
    });

    // Step 8: Return analysis
    res.status(201).json({
      success: true,
      message: 'Resume analyzed successfully',
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get analysis history for logged in user
// @route   GET /api/resume/history
// @access  Private
const getAnalysisHistory = async (req, res, next) => {
  try {
    const history = await Analysis.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Analysis history retrieved successfully',
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single analysis by ID
// @route   GET /api/resume/:id
// @access  Private
const getAnalysisById = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      res.status(404);
      throw new Error('Analysis report not found');
    }

    // Auth validation: check that this analysis belongs to the logged in user
    if (analysis.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Unauthorized to view this analysis report');
    }

    res.status(200).json({
      success: true,
      message: 'Analysis report retrieved successfully',
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a single analysis report
// @route   PUT /api/resume/:id
// @access  Private
const updateAnalysis = async (req, res, next) => {
  try {
    const { jobDescription } = req.body;
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      res.status(404);
      throw new Error('Analysis report not found');
    }

    // Auth validation
    if (analysis.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Unauthorized to update this analysis report');
    }

    if (jobDescription !== undefined) {
      analysis.jobDescription = jobDescription;
    }

    await analysis.save();

    res.status(200).json({
      success: true,
      message: 'Analysis report updated successfully',
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a single analysis report
// @route   DELETE /api/resume/:id
// @access  Private
const deleteAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      res.status(404);
      throw new Error('Analysis report not found');
    }

    // Auth validation
    if (analysis.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Unauthorized to delete this analysis report');
    }

    await Analysis.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Analysis report deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadAndAnalyzeResume,
  getAnalysisHistory,
  getAnalysisById,
  updateAnalysis,
  deleteAnalysis,
};
