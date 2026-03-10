const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/create-order", async (req, res) => {

  try {

    const { amount, email } = req.body;

    const orderId = "order_" + Date.now();

    const response = await axios.post(
      "https://sandbox.cashfree.com/pg/orders",
      {
        order_id: orderId,
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: email,
          customer_email: email,
          customer_phone: "9999999999"
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2022-09-01"
        }
      }
    );

    res.json(response.data);

  } catch (error) {

    console.error("Cashfree error:", error.response?.data || error);

    res.status(500).json({
      message: "Payment creation failed"
    });

  }

});

module.exports = router;
