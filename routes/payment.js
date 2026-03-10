const express = require("express");
const router = express.Router();
const { Cashfree } = require("cashfree-pg");

const cashfree = new Cashfree({
  mode: "sandbox", // test mode
  appId: process.env.CASHFREE_APP_ID,
  secretKey: process.env.CASHFREE_SECRET_KEY
});

router.post("/create-order", async (req, res) => {
  try {

    const { amount, email } = req.body;

    const orderId = "order_" + Date.now();

    const request = {
      order_amount: amount,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: email,
        customer_email: email,
        customer_phone: "9999999999"
      },
      order_meta: {
        return_url: "https://arjewellery-d953b.web.app/payment-success.html"
      }
    };

    const response = await cashfree.PGCreateOrder("2022-09-01", request);

    res.json(response.data);

  } catch (error) {

    console.error("Cashfree error:", error);

    res.status(500).json({
      message: "Cashfree order creation failed"
    });

  }
});

module.exports = router;
