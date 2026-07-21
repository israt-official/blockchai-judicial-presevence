const Case = require("../models/Case");
const User = require("../models/User");

const createCase = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Please provide title and description",
      });
    }

    const newCase = await Case.create({
      title,
      description,
      policeOfficer: req.user._id,
    });

    res.status(201).json({
      message: "Case created successfully",
      case: newCase,
    });
  } catch (error) {
    res.status(500).json({
      message: "Case creation failed",
      error: error.message,
    });
  }
};

const assignJudge = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { judgeId } = req.body;

    const judge = await User.findOne({
      userId: judgeId,
      role: "JUDGE",
    });

    if (!judge) {
      return res.status(404).json({
        message: "Judge not found",
      });
    }

    const updatedCase = await Case.findOneAndUpdate(
      { caseId },
      {
        assignedJudge: judge._id,
        status: "UNDER_REVIEW",
      },
      { new: true }
    )
      .populate("policeOfficer", "name email role")
      .populate("assignedJudge", "name email role");

    if (!updatedCase) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    res.status(200).json({
      message: "Judge assigned successfully",
      case: updatedCase,
    });
  } catch (error) {
    res.status(500).json({
      message: "Judge assignment failed",
      error: error.message,
    });
  }
};

const getMyCases = async (req, res) => {
  try {
    let cases;

    if (req.user.role === "POLICE") {
      cases = await Case.find({ policeOfficer: req.user._id })
        .populate("policeOfficer", "name email role")
        .populate("assignedJudge", "name email role");
    } else if (req.user.role === "JUDGE") {
      cases = await Case.find({ assignedJudge: req.user._id })
        .populate("policeOfficer", "name email role")
        .populate("assignedJudge", "name email role");
    } else {
      return res.status(403).json({
        message: "Only police and judges can view cases here",
      });
    }

    res.status(200).json({
      message: "Cases fetched successfully",
      cases,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch cases",
      error: error.message,
    });
  }
};

const getCaseById = async (req, res) => {
  try {
    const { caseId } = req.params;

    const caseData = await Case.findOne({ caseId })
      .populate("policeOfficer", "name email role")
      .populate("assignedJudge", "name email role");

    if (!caseData) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    const isPoliceOwner =
      req.user.role === "POLICE" &&
      caseData.policeOfficer._id.toString() === req.user._id.toString();

    const isAssignedJudge =
      req.user.role === "JUDGE" &&
      caseData.assignedJudge &&
      caseData.assignedJudge._id.toString() === req.user._id.toString();

    if (!isPoliceOwner && !isAssignedJudge) {
      return res.status(403).json({
        message: "You are not allowed to view this case",
      });
    }

    res.status(200).json({
      message: "Case fetched successfully",
      case: caseData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch case",
      error: error.message,
    });
  }
};

module.exports = {
  createCase,
  assignJudge,
  getMyCases,
  getCaseById,
};
