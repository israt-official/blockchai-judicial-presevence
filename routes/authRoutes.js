const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "Profile access granted",
    user: req.user,
  });
});

router.get("/police-only", protect, authorizeRoles("POLICE"), (req, res) => {
  res.status(200).json({
    message: "Police access granted",
  });
});

router.get("/judge-only", protect, authorizeRoles("JUDGE"), (req, res) => {
  res.status(200).json({
    message: "Judge access granted",
  });
});

module.exports = router;