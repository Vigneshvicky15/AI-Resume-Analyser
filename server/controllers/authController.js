const crypto = require('crypto');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please fill in all fields (name, email, password)');
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters long');
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this email address');
    }

    // Check if SMTP is configured
    const isSmtpConfigured = !!(process.env.SMTP_USER && process.env.SMTP_PASS);

    // Generate OTP (Use 123456 as a universal testing OTP if no email is configured)
    const otp = isSmtpConfigured 
      ? Math.floor(100000 + Math.random() * 900000).toString()
      : '123456';
    const otpExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    let isVerified = false;

    if (isSmtpConfigured) {
      console.log('[SMTP] Attempting to send registration OTP email to:', normalizedEmail);
      sendEmail({
        email: normalizedEmail,
        subject: 'ResumePilot AI - Email Verification OTP',
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 500px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 12px;">
            <h2 style="color: #4f46e5; text-align: center;">Welcome to ResumePilot AI!</h2>
            <p>Thank you for signing up. Please verify your email address by entering this 6-digit OTP code on the verification screen:</p>
            <h1 style="background: #f4f4f5; padding: 15px; border-radius: 8px; text-align: center; letter-spacing: 5px; color: #4f46e5; font-size: 32px; font-family: monospace; margin: 20px 0;">${otp}</h1>
            <p>This code will expire in <strong>15 minutes</strong>.</p>
            <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 20px 0;" />
            <p style="font-size: 11px; color: #71717a; text-align: center;">If you did not request this email, please ignore it.</p>
          </div>
        `
      }).then(() => {
        console.log('[SMTP] OTP email sent successfully.');
      }).catch((mailError) => {
        console.error('[SMTP] Failed to send registration OTP email:', mailError.message);
        console.log(`[DEV MODE] Since email failed, your OTP is: ${otp}`);
      });
    } else {
      console.warn('[SMTP] Mail credentials missing. Forcing verification flow anyway.');
      console.log(`======================================`);
      console.log(`[DEV MODE] SMTP not configured!`);
      console.log(`[DEV MODE] User: ${normalizedEmail}`);
      console.log(`[DEV MODE] Your OTP is: ${otp}`);
      console.log(`======================================`);
    }

    // Create user
    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      isVerified,
      otp: isVerified ? null : otp,
      otpExpiry: isVerified ? null : otpExpiry,
      role: normalizedEmail === 'ai.resume.analyser5@gmail.com' ? 'admin' : 'user',
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: isVerified ? 'User registered and auto-verified successfully' : 'OTP sent to email. Please verify your account.',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
          // Only return token if auto-verified
          token: isVerified ? generateToken(user._id) : null,
        },
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data received');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email using OTP code
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400);
      throw new Error('Please provide email and OTP code');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      res.status(400);
      throw new Error('User not found');
    }

    if (user.isVerified) {
      res.status(200).json({
        success: true,
        message: 'Account is already verified. You can log in.',
        data: {
          token: generateToken(user._id),
        }
      });
      return;
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      res.status(400);
      throw new Error('Invalid or expired OTP code');
    }

    // Mark as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account verified successfully!',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend OTP verification code
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400);
      throw new Error('Please provide email address');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      res.status(400);
      throw new Error('User not found');
    }

    if (user.isVerified) {
      res.status(400);
      throw new Error('This account is already verified.');
    }

    const isSmtpConfigured = !!(process.env.SMTP_USER && process.env.SMTP_PASS);

    // Generate new OTP (Use 123456 as a universal testing OTP if no email is configured)
    const otp = isSmtpConfigured 
      ? Math.floor(100000 + Math.random() * 900000).toString()
      : '123456';
    const otpExpiry = Date.now() + 15 * 60 * 1000; // 15 mins

    // Send email
    if (isSmtpConfigured) {
      sendEmail({
        email: normalizedEmail,
        subject: 'ResumePilot AI - New Verification OTP',
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 500px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 12px;">
            <h2 style="color: #4f46e5; text-align: center;">New Verification Code</h2>
            <p>You requested a new verification code. Please verify your email address by entering this 6-digit OTP code:</p>
            <h1 style="background: #f4f4f5; padding: 15px; border-radius: 8px; text-align: center; letter-spacing: 5px; color: #4f46e5; font-size: 32px; font-family: monospace; margin: 20px 0;">${otp}</h1>
            <p>This code will expire in <strong>15 minutes</strong>.</p>
          </div>
        `
      }).then(() => {
        console.log('[SMTP] Resend OTP email sent successfully.');
      }).catch((err) => {
        console.log(`[DEV MODE] Since email failed, your new OTP is: ${otp}`);
      });
    } else {
      console.warn('[SMTP] Mail credentials missing. Logging new OTP to console...');
      console.log(`======================================`);
      console.log(`[DEV MODE] SMTP not configured!`);
      console.log(`[DEV MODE] User: ${normalizedEmail}`);
      console.log(`[DEV MODE] Your New OTP is: ${otp}`);
      console.log(`======================================`);
    }

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'A new verification code has been sent to your email address.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check for user email
    const user = await User.findOne({ email: normalizedEmail });

    if (user && (await user.matchPassword(password))) {
      // Prevent login if not verified
      if (!user.isVerified) {
        res.status(401);
        throw new Error('Please verify your email address before logging in.');
      }

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role || 'user',
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password Request
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400);
      throw new Error('Please provide email address');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      res.status(400);
      throw new Error('No account found with this email address');
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set expiry
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      sendEmail({
        email: user.email,
        subject: 'ResumePilot AI - Password Reset Link',
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 500px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 12px;">
            <h2 style="color: #4f46e5; text-align: center;">Password Reset Request</h2>
            <p>You requested a password reset. Please click the button below to set a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: #4f46e5; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #71717a; font-size: 12px; background: #f4f4f5; padding: 10px; border-radius: 6px;">${resetUrl}</p>
            <p>This link will expire in <strong>30 minutes</strong>.</p>
          </div>
        `
      }).then(() => {
        console.log('[SMTP] Forgot Password email sent successfully.');
      }).catch(async (err) => {
        // Rollback token on failure
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;
        await user.save();
        console.error('[SMTP] Forgot Password email failed:', err);
      });
    } else {
      console.warn('[SMTP] Mail credentials missing. Reset URL (dev output):', resetUrl);
      res.status(200).json({
        success: true,
        message: `[Dev Mode Link] Password reset token generated successfully. Link: ${resetUrl}`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email address.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password using token
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      res.status(400);
      throw new Error('Please enter a valid password (min 6 characters)');
    }

    // Get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      throw new Error('Invalid or expired password reset token');
    }

    // Set new password (will be hashed by pre-save hook)
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now log in.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'User profile retrieved',
      data: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role || 'user',
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
};
