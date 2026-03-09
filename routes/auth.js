const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

let otpStore = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


// SEND OTP
router.post("/send-otp", async (req, res) => {

  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);

  otpStore[email] = otp;

  try {

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "AR Jewellery Login OTP",
      html: `<h2>Your OTP is ${otp}</h2>`
    });

    res.json({
      success: true,
      message: "OTP sent"
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Failed to send OTP"
    });

  }

});


// VERIFY OTP
router.post("/verify-otp", (req, res) => {

  const { email, otp } = req.body;

  if (otpStore[email] == otp) {

    delete otpStore[email];

    return res.json({
      success: true,
      message: "Login success"
    });

  }

  res.status(400).json({
    success: false,
    message: "Invalid OTP"
  });

});

module.exports = router;