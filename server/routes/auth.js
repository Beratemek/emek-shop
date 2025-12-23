const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();

const SECRET = process.env.JWT_SECRET || 'test_secret_key_CHANGE_IN_PRODUCTION';

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({ email, password: hashedPassword, name });

    const token = jwt.sign({ email: result.email, id: result._id, role: result.role }, SECRET, { expiresIn: '1h' });

    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(404).json({ message: 'User not found' });

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ email: existingUser.email, id: existingUser._id, role: existingUser.role }, SECRET, { expiresIn: '1h' });

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Forgot Password
router.post('/forgotPassword', async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: 'There is no user with that email' });

  // Generate Reset Token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash and set to resetPasswordToken
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 Minutes

  await user.save();

  // Create reset url
  // Note: Frontend will handle this route
  const resetUrl = `https://emekshop.com/auth/resetpassword/${resetToken}`;

  const message = `
    <h1>Şifre Sıfırlama İsteği</h1>
    <p>Aşağıdaki linke tıklayarak şifrenizi sıfırlayabilirsiniz:</p>
    <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
    <p>Bu isteği siz yapmadıysanız lütfen dikkate almayınız.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'EmekShop Şifre Sıfırlama',
      html: message,
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    console.log(error);
    return res.status(500).json({ message: 'Email could not be sent' });
  }
});

// Reset Password
router.post('/resetPassword/:resetToken', async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: 'Invalid token' });

  // Set new password
  user.password = await bcrypt.hash(req.body.password, 12);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = jwt.sign({ email: user.email, id: user._id, role: user.role }, SECRET, { expiresIn: '1h' });

  res.status(200).json({ success: true, token, result: user });
});

module.exports = router;
