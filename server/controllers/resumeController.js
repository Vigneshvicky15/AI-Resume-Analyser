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

    // Cascade delete file from Cloudinary if applicable
    if (analysis.resumeUrl && analysis.resumeUrl.includes('cloudinary.com')) {
      try {
        const parts = analysis.resumeUrl.split('/');
        const folderIndex = parts.indexOf('ai_resumes');
        if (folderIndex !== -1 && folderIndex < parts.length - 1) {
          const filename = parts[parts.length - 1]; // e.g. resume_1716480009.pdf
          const publicIdWithoutExt = filename.split('.')[0];
          const publicId = `ai_resumes/${publicIdWithoutExt}`;

          console.log('[Cloudinary] Cascade deleting file from Cloudinary:', publicId);
          // PDF files are uploaded as 'image' or 'raw' in Cloudinary depending on format
          await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
          await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        }
      } catch (clError) {
        console.warn('[Cloudinary] Failed to delete file during report cascade (non-blocking):', clError.message);
      }
    }

    // Delete local static file backup if applicable
    if (analysis.resumeUrl && !analysis.resumeUrl.includes('cloudinary.com')) {
      try {
        const parts = analysis.resumeUrl.split('/');
        const filename = parts[parts.length - 1];
        const localFilePath = path.join(__dirname, '..', 'uploads', filename);
        if (fs.existsSync(localFilePath)) {
          fs.unlinkSync(localFilePath);
          console.log('[Local File] Cascade deleted local file:', localFilePath);
        }
      } catch (fsError) {
        console.warn('[Local File] Failed to delete local file (non-blocking):', fsError.message);
      }
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

// @desc    Download analysis report PDF
// @route   GET /api/resume/:id/download
// @access  Private
const downloadPDF = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      res.status(404);
      throw new Error('Analysis report not found');
    }

    // Auth validation
    if (analysis.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Unauthorized to view this report');
    }

    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument({ margin: 50 });

    // Set Response Headers for PDF streaming attachment download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ResumePilot_Report_${req.params.id}.pdf`);
    doc.pipe(res);

    // Title
    doc.fillColor('#4f46e5').fontSize(26).text('ResumePilot AI Report', { align: 'center' });
    doc.moveDown(0.5);
    doc.fillColor('#71717a').fontSize(10).text(`Generated on: ${new Date(analysis.createdAt).toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(1.5);

    // Scores summary block (draw grey rect)
    const currentY = doc.y;
    doc.fillColor('#f1f5f9').rect(50, currentY, 512, 80).fill();

    // Write scores over the rect
    doc.fillColor('#4f46e5').fontSize(14).text('ATS Score', 70, currentY + 15);
    doc.fillColor('#1e293b').fontSize(24).text(`${analysis.score}/100`, 70, currentY + 35);

    doc.fillColor('#06b6d4').fontSize(14).text('Job Match', 320, currentY + 15);
    doc.fillColor('#1e293b').fontSize(24).text(`${analysis.jobMatchPercentage}%`, 320, currentY + 35);

    // Reset cursor positioning
    doc.y = currentY + 95;

    // Domain and Level
    doc.fillColor('#1e293b').fontSize(12).font('Helvetica-Bold').text(`Domain: `, { continued: true })
       .font('Helvetica').text(`${analysis.domain || 'General Professional'}    |    `, { continued: true })
       .font('Helvetica-Bold').text(`Experience Level: `, { continued: true })
       .font('Helvetica').text(`${analysis.experienceLevel || 'Mid Level'}`);

    doc.moveDown(1.5);

    // Strengths
    doc.font('Helvetica-Bold').fillColor('#10b981').fontSize(14).text('Strengths');
    doc.font('Helvetica').fillColor('#334155').fontSize(11).moveDown(0.3);
    if (analysis.strengths && analysis.strengths.length > 0) {
      analysis.strengths.forEach(str => doc.text(`• ${str}`));
    } else {
      doc.text('No critical strengths listed.');
    }
    doc.moveDown(1.5);

    // Weaknesses
    doc.font('Helvetica-Bold').fillColor('#ef4444').fontSize(14).text('Weaknesses / Areas for Improvement');
    doc.font('Helvetica').fillColor('#334155').fontSize(11).moveDown(0.3);
    if (analysis.weaknesses && analysis.weaknesses.length > 0) {
      analysis.weaknesses.forEach(wk => doc.text(`• ${wk}`));
    } else {
      doc.text('No critical weaknesses listed.');
    }
    doc.moveDown(1.5);

    // Missing Skills
    doc.font('Helvetica-Bold').fillColor('#f59e0b').fontSize(14).text('Missing Skills');
    doc.font('Helvetica').fillColor('#334155').fontSize(11).moveDown(0.3);
    if (analysis.missingSkills && analysis.missingSkills.length > 0) {
      doc.text(analysis.missingSkills.join(', '));
    } else {
      doc.text('No missing skills found compared to target role.');
    }
    doc.moveDown(1.5);

    // Improvement Suggestions
    doc.font('Helvetica-Bold').fillColor('#6366f1').fontSize(14).text('Actionable Suggestions');
    doc.font('Helvetica').fillColor('#334155').fontSize(11).moveDown(0.3);
    if (analysis.suggestions && analysis.suggestions.length > 0) {
      analysis.suggestions.forEach(sug => doc.text(`• ${sug}`));
    } else {
      doc.text('No suggestion listed.');
    }

    doc.end();

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
  downloadPDF,
};
