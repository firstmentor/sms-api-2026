const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true
  },

  name: {
    type: String,
    required: true
  },

  code: {
    type: String,
    required: true
  },

  maxMarks: {
    type: Number,
    default: 100
  }
}, { timestamps: true });

// ❗ Same subject name/code cannot repeat in same class
subjectSchema.index(
  { class: 1, code: 1 },
  { unique: true }
);

module.exports = mongoose.model("Subject", subjectSchema);
