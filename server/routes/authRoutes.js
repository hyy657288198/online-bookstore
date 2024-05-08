// authRoutes.js

const express = require('express');
const nodemailer = require('nodemailer');
const authController = require('../controllers/authController');
const pool = require("../database/db");
const { registerUser, loginUser, DeactivatedError } = authController;
const util = require('../util/util')

const router = express.Router();

// Google OAuth authentication route
router.get('/google', authController.googleAuth);

// Google OAuth authentication callback route
router.get('/google/callback', authController.handleGoogleAuthCallback);


router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  console.log('Registration request body:', req.body);
  try {
    const message = await registerUser(username, email, password);
    const verificationToken = generateVerificationToken();
    console.log(verificationToken)
    console.log("verificationToken")
    await sendVerificationEmail(email, verificationToken);
    res.status(201).send(message);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request body:', req.body);
  try {
    const message = await loginUser(email, password);
    console.log("message:" + message)

    res.status(200).json(message);
  } catch (error) {
    if (error.message === 'Account is deactivated. Please contact the site administrator.') {
      res.status(403).send(error.message);
    } else {
      res.status(500).send(error.message);
    }

  }
});

async function sendVerificationEmail(email, verificationToken) {
  console.log("get in sending email")
  await pool.query('INSERT INTO user_verification (user_email, validation_token) VALUES ($1, $2)', [email, verificationToken]);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: '9065bookstore2023f@gmail.com',
      pass: 'snra lalu lkle qykr',
    },
  });

  const mailOptions = {
    from: '9065bookstore2023f@gmail.com',
    to: email,
    subject: 'Email Verification',
    html: `<p>Click <a href={util.backend +"/verify/${verificationToken}"}>here</a> to verify your email.</p>`,
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      // Handle the error here
    } else {
      console.log('Email sent:', info.response);
      // Email sent successfully
    }
  });
}

// Helper function to generate a verification token
function generateVerificationToken() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

module.exports = router;

