const mongoose = require("mongoose");
const { randomUUID } = require("crypto");

const evidenceSchema = new mongoose.Schema(
  {
    evidenceId: {
      type: String,
      default: randomUUID,
      unique: true,
    },

    caseId: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    uploadedByRole: {
      type: String,
      required: true,
      enum: ["POLICE", "FORENSIC"],
    },

    evidenceType: {
      type: String,
      required: true,
      enum: ["POLICE_EVIDENCE", "FORENSIC_REPORT"],
    },

    fileName: {
      type: String,
      required: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    fileHash: {
      type: String,
      required: true,
    },

    digitalSignature: {
      type: String,
      default: null,
    },

    blockchainHash: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Evidence", evidenceSchema);
