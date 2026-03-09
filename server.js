const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./db");
const User = require("./models/User");

dotenv.config();
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

// This makes images publicly accessible
app.use("/images", express.static(path.join(__dirname, "images")));

/* =========================
   ROUTES
========================= */

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

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
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   DEFAULT ROUTE
========================= */

app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
