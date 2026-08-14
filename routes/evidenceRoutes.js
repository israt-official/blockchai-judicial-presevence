const express = require("express");
const {
  uploadEvidence,
  getMyEvidence,
  getAllEvidence,
} = require("../controllers/evidenceController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/upload",
  protect,
  authorizeRoles("POLICE", "FORENSIC"),
  upload.single("evidenceFile"),
  uploadEvidence
);

router.get(
  "/my-evidence",
  protect,
  authorizeRoles("POLICE", "FORENSIC"),
  getMyEvidence
);
router.get(
   "/all",
  protect,
  authorizeRoles("JUDGE"),
  getAllEvidence
);


module.exports = router;
