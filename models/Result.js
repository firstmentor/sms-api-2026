const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true
    },

    semester: {
      type: Number,
      required: true
    },

    year: {
      type: Number,
      required: true
    },

    marksObtained: {
      type: Number,
      required: true
    },

    totalMarks: {
      type: Number,
      required: true
    },

    percentage: {
      type: Number
    },

    grade: {
      type: String
    }
  },
  { timestamps: true }
);

/**
 * 🔒 Ek student ka ek subject ka result
 * ek hi semester + year me sirf ek baar add ho
 */
resultSchema.index(
  { student: 1, subject: 1, semester: 1, year: 1 },
  { unique: true }
);

module.exports = mongoose.model("Result", resultSchema);
