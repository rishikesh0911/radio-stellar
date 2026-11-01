
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/database");

const stationRoutes = require("./routes/stationRoutes");
const authRoutes = require("./routes/authRoutes");
// const favoriteRoutes = require("./routes/favoriteRoutes");
// const historyRoutes = require("./routes/historyRoutes");

const app = express();

app.use(helmet());
app.use(compression());

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));

app.use(express.json({ limit: "20kb" }));

app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false
}));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Radio Garden API is running"
  });
});

app.use("/api/stations", stationRoutes);
app.use("/api/auth", authRoutes);
// app.use("/api/favorites", favoriteRoutes);
// app.use("/api/history", historyRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found"
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.status ? err.message : "Internal server error"
  });
});

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
