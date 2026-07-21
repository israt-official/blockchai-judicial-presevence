const Case = require("../models/Case");
const Evidence = require("../models/Evidence");
const { generateFileHash } = require("../services/hashService");

const uploadEvidence = async (req, res) => {
  try {
    const { caseId } = req.body;

    if (!caseId) {
      return res.status(400).json({
        message: "Please provide caseId",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a file",
      });
    }

    const caseData = await Case.findOne({ caseId });

    if (!caseData) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    const isPoliceOwner =
      req.user.role === "POLICE" &&
      caseData.policeOfficer.toString() === req.user._id.toString();

    const isForensicOfficer = req.user.role === "FORENSIC";

    if (!isPoliceOwner && !isForensicOfficer) {
      return res.status(403).json({
        message: "You are not allowed to upload evidence for this case",
      });
    }

    const fileHash = await generateFileHash(req.file.path);
    const evidenceType =
      req.user.role === "POLICE" ? "POLICE_EVIDENCE" : "FORENSIC_REPORT";

    const evidence = await Evidence.create({
      caseId,
      uploadedBy: req.user._id,
      uploadedByRole: req.user.role,
      evidenceType,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      fileHash,
    });

    res.status(201).json({
      message: "Evidence uploaded successfully",
      evidence,
    });
  } catch (error) {
    res.status(500).json({
      message: "Evidence upload failed",
      error: error.message,
    });
  }
};

const getMyEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.find({ uploadedBy: req.user._id }).populate(
      "uploadedBy",
      "name email role"
    );

    res.status(200).json({
      message: "Evidence fetched successfully",
      evidence,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch evidence",
      error: error.message,
    });
  }
};

module.exports = {
  uploadEvidence,
  getMyEvidence,
};
