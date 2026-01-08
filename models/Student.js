const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  rollNo: { type: String, required: true, unique: true },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true
  },
  year: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
