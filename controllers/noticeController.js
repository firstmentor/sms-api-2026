const Notice = require("../models/Notice");

// Add Notice
exports.addNotice = async (req, res) => {
  try {
    const { title, date, color } = req.body;

    const notice = new Notice({
      title,
      date,
      color,
    });

    await notice.save();

    res.status(201).json({
      success: true,
      message: "Notice Added",
      notice,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Notices
exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });

    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Notice
exports.deleteNotice = async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Notice Deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};