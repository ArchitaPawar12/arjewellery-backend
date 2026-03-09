const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

let otpStore = {};

/* =========================
   MAIL CONFIG (FIXED)
========================= */

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  connectionTimeout: 10000,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


/* =========================
   SEND OTP
========================= */

router.post("/send-otp", async (req, res) => {

  console.log("Send OTP request received:", req.body);

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required"
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  otpStore[email] = otp;

  console.log("Generated OTP:", otp);

  try {

    await transporter.sendMail({
      from: `"AR Jewellery" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "AR Jewellery Login OTP",
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>AR Jewellery Login OTP</h2>
          <p>Your One Time Password is:</p>
          <h1 style="color:#000">${otp}</h1>
          <p>This OTP is valid for a short time.</p>
        </div>
      `
    });

    console.log("OTP email sent successfully");

    res.json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (err) {

    console.error("Email sending error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to send OTP"
    });

  }

});


/* =========================
   VERIFY OTP
========================= */

router.post("/verify-otp", (req, res) => {

  console.log("Verify OTP request:", req.body);

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP required"
    });
  }

  if (otpStore[email] && otpStore[email] == otp) {

    delete otpStore[email];

    console.log("OTP verified successfully");

    return res.json({
      success: true,
      message: "Login success"
    });

  }

  console.log("Invalid OTP attempt");

  res.status(400).json({
    success: false,
    message: "Invalid OTP"
  });

});

module.exports = router;
