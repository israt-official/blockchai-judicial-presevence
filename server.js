require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const caseRoutes = require("./routes/caseRoutes");
const evidenceRoutes = require("./routes/evidenceRoutes");

const app = express();

connectDB();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/evidence", evidenceRoutes);

app.get("/", (req, res) => {
  res.send("Judicial Blockchain Server Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
