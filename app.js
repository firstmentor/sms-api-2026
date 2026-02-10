const express = require("express");
const app = express();
const dotenv = require("dotenv");
const web = require("./routes/web");
const connectDb = require("./db/connectDb");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

// ✅ JSON middleware
app.use(express.json());

// ✅ Cookie parser (IMPORTANT)
app.use(cookieParser());

// ✅ CORS FIX (COOKIE JWT KE LIYE)
app.use(
  cors({
    origin: "http://localhost:5173", // 👈 React URL
    credentials: true               // 👈 allow cookies
  })
);

// ✅ DB Connect
connectDb();

// ✅ Routes
app.use("/api", web);

// ✅ Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
