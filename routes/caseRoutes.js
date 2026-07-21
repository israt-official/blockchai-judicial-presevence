const express = require("express");
const {
  createCase,
  assignJudge,
  getMyCases,
  getCaseById,
} = require("../controllers/caseController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, authorizeRoles("POLICE"), createCase);

router.patch(
  "/:caseId/assign-judge",
  protect,
  authorizeRoles("POLICE"),
  assignJudge
);

router.get("/my-cases", protect, getMyCases);

router.get("/:caseId", protect, getCaseById);

module.exports = router;
