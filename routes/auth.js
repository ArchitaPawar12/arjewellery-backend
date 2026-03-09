const express = require("express");
const router = express.Router();
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

let otpStore = {};


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

    await resend.emails.send({
      from: "AR Jewellery <onboarding@resend.dev>",
      to: email,
      subject: "AR Jewellery Login OTP",
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>AR Jewellery Login OTP</h2>
          <p>Your One Time Password is:</p>
          <h1 style="color:black">${otp}</h1>
          <p>This OTP is valid for login.</p>
        </div>
      `
    });

    console.log("OTP email sent successfully");

    res.json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {

    console.error("Email sending error:", error);

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
