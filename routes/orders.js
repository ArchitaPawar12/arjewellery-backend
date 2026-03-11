const express = require("express");
const router = express.Router();
const Order = require("../models/Order");


/* =========================
   CREATE ORDER
========================= */

router.post("/", async (req, res) => {
  try {

    const {
      firstname,
      lastname,
      email,
      address,
      city,
      zip,
      items,
      total
    } = req.body;

    const orderItems = Array.isArray(items) ? items : [];

    const products = orderItems.map(item => ({
      productId: item.productId || item.id || "",
      name: item.name || "Product",
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      image: item.image || ""
    }));

    const newOrder = new Order({
      customerName: `${firstname || ""} ${lastname || ""}`.trim(),
      email: email || "",
      address: `${address || ""}, ${city || ""} - ${zip || ""}`,
      products: products,
      totalAmount: Number(total) || 0,
      status: "Processing"
    });

    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);

  } catch (error) {

    console.error("Order creation error:", error);

    res.status(500).json({
      message: "Order creation failed"
    });

  }
});


/* =========================
   GET ORDERS
========================= */

router.get("/", async (req, res) => {
  try {

    const { email } = req.query;

    let orders;

    if (email) {
      orders = await Order.find({ email }).sort({ createdAt: -1 });
    } else {
      orders = await Order.find().sort({ createdAt: -1 });
    }

    res.json(orders);

  } catch (error) {

    console.error("Fetch orders error:", error);

    res.status(500).json({
      message: "Failed to fetch orders"
    });

  }
});


/* =========================
   UPDATE ORDER STATUS
========================= */

router.put("/:id", async (req, res) => {

  try {

    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updatedOrder);

  } catch (error) {

    console.error("Status update error:", error);

    res.status(500).json({
      message: "Failed to update order status"
    });

  }

});


module.exports = router;
