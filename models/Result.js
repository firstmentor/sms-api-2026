const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  marksObtained: { type: Number, required: true },
  semester: { type: Number, required: true },
  year: { type: Number, required: true }
}, { timestamps: true });

// Prevent duplicate entry of same student + subject
resultSchema.index({ student: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model("Result", resultSchema);
