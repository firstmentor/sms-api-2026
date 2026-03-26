const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: String,
    },
    color: {
      type: String,
      default: "blue",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notice", noticeSchema);