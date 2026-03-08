const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   FIXED STATIC IMAGE FOLDER
========================= */

// VERY IMPORTANT FIX
// Go one level up from backend to reach main project folder

app.use(
  "/images",
  express.static(path.join(__dirname, "../images"))
);

/* =========================
   ROUTES
========================= */

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const orderRoutes = require("./routes/orders");
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);