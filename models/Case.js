const mongoose = require("mongoose");
const { randomUUID } = require("crypto");

const caseSchema = new mongoose.Schema(
  {
    caseId: {
      type: String,
      default: randomUUID,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    policeOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedJudge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["OPEN", "UNDER_REVIEW", "CLOSED"],
      default: "OPEN",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Case", caseSchema);