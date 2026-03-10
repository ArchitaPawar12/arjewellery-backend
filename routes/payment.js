const express = require("express");
const router = express.Router();
const Cashfree = require("cashfree-pg");

Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

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
      }
    };

    const response = await Cashfree.PGCreateOrder("2022-09-01", request);

    res.json(response.data);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Cashfree order creation failed"
    });

  }

});

module.exports = router;