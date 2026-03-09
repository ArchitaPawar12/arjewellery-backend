const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./db");
const User = require("./models/User");

// Load environment variables
dotenv.config();

// Connect database
connectDB();

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());

/* =========================
   SERVE IMAGES FOLDER
========================= */

// Makes /images publicly accessible
// Example:
// https://arjewellery-backend.onrender.com/images/necklaces/necklace-24.jpg

app.use(
  "/images",
  express.static(path.join(__dirname, "images"))
);

/* =========================
   ROUTES
========================= */

// Products
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Orders
const orderRoutes = require("./routes/orders");
app.use("/api/orders", orderRoutes);

/* =========================
   SAVE USER AFTER FIREBASE LOGIN
========================= */

app.post("/api/save-user", async (req, res) => {
  try {
    const { uid, email } = req.body;

    let user = await User.findOne({ uid });

    if (!user) {
      user = new User({ uid, email });
      await user.save();
    }

    res.json({ message: "User saved successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   DEFAULT ROUTE
========================= */

app.get("/", (req, res) => {
  res.send("AR Jewellery Backend is running 🚀");
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
