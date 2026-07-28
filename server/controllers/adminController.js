const User = require('../models/User');
const Analysis = require('../models/Analysis');
const cloudinary = require('../config/cloudinary');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalReports = await Analysis.countDocuments({});

    // Fetch reports created today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const dailyUploads = await Analysis.countDocuments({
      createdAt: { $gte: startOfToday }
    });

    res.status(200).json({
      success: true,
      message: 'Admin statistics retrieved successfully',
      data: {
        totalUsers,
        totalReports,
        dailyUploads
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Users with search filtering
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Users list retrieved successfully',
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Reports
// @route   GET /api/admin/reports
// @access  Private/Admin
const getAllReports = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};

    // Populating user details so we can search by user's email
    let analyses = await Analysis.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    if (search) {
      const lowerSearch = search.toLowerCase();
      analyses = analyses.filter(analysis => {
        return (
          (analysis.user && analysis.user.email.toLowerCase().includes(lowerSearch)) ||
          (analysis.user && analysis.user.name.toLowerCase().includes(lowerSearch)) ||
          (analysis.domain && analysis.domain.toLowerCase().includes(lowerSearch))
        );
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reports list retrieved successfully',
      data: analyses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a User and all their associated reports (Cascade)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user.role === 'admin') {
      res.status(400);
      throw new Error('Cannot delete administrative accounts');
    }

    // Cascade delete: Find all analyses belonging to this user
    const userAnalyses = await Analysis.find({ user: user._id });

    for (const analysis of userAnalyses) {
      // Delete Cloudinary assets
      if (analysis.resumeUrl && analysis.resumeUrl.includes('cloudinary.com')) {
        try {
          const parts = analysis.resumeUrl.split('/');
          const folderIndex = parts.indexOf('ai_resumes');
          if (folderIndex !== -1 && folderIndex < parts.length - 1) {
            const filename = parts[parts.length - 1];
            const publicIdWithoutExt = filename.split('.')[0];
            const publicId = `ai_resumes/${publicIdWithoutExt}`;
            await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
            await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
          }
        } catch (clError) {
          console.warn('[Cloudinary Cascade Admin] Failed to delete file:', clError.message);
        }
      }
    }

    // Delete associated reports from MongoDB
    await Analysis.deleteMany({ user: user._id });

    // Delete user from MongoDB
    await User.deleteOne({ _id: user._id });

    res.status(200).json({
      success: true,
      message: 'User and all associated analysis reports deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin delete of any report
// @route   DELETE /api/admin/reports/:id
// @access  Private/Admin
const deleteReport = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      res.status(404);
      throw new Error('Analysis report not found');
    }

    // Delete from Cloudinary
    if (analysis.resumeUrl && analysis.resumeUrl.includes('cloudinary.com')) {
      try {
        const parts = analysis.resumeUrl.split('/');
        const folderIndex = parts.indexOf('ai_resumes');
        if (folderIndex !== -1 && folderIndex < parts.length - 1) {
          const filename = parts[parts.length - 1];
          const publicIdWithoutExt = filename.split('.')[0];
          const publicId = `ai_resumes/${publicIdWithoutExt}`;
          await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
          await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        }
      } catch (clError) {
        console.warn('[Cloudinary Cascade Admin] Failed to delete file:', clError.message);
      }
    }

    await Analysis.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Analysis report deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  getAllReports,
  deleteUser,
  deleteReport
};
