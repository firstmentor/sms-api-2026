const Result = require("../models/Result");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const { addResultValidation, updateResultValidation } = require("../validations/resultValidation");

class ResultController {

  // ================= ADD RESULT =================
  static addResult = async (req, res) => {
    try {
      const { error } = addResultValidation.validate(req.body);
      if (error) return res.status(400).json({ message: error.details[0].message });

      const { studentId, subjectId, marksObtained, semester, year } = req.body;

      const student = await Student.findById(studentId);
      if (!student) return res.status(404).json({ message: "Student not found" });

      const subject = await Subject.findById(subjectId);
      if (!subject) return res.status(404).json({ message: "Subject not found" });

      // check duplicate
      const existResult = await Result.findOne({ student: studentId, subject: subjectId });
      if (existResult) return res.status(400).json({ message: "Result already exists for this subject" });

      const result = await Result.create({
        student: studentId,
        subject: subjectId,
        marksObtained,
        semester,
        year
      });

      res.status(201).json({ message: "Result added successfully", result });

    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  };

  // ================= GET ALL RESULTS =================
  static getAllResults = async (req, res) => {
    const results = await Result.find()
      .populate("student", "rollNo class user")
      .populate("subject", "name code maxMarks");
    res.status(200).json(results);
  };

  // ================= GET RESULTS BY STUDENT =================
  static getResultsByStudent = async (req, res) => {
    const results = await Result.find({ student: req.params.studentId })
      .populate("subject", "name code maxMarks")
      .populate("student", "rollNo class user");
    res.status(200).json(results);
  };

  // ================= UPDATE RESULT =================
  static updateResult = async (req, res) => {
    try {
      const { error } = updateResultValidation.validate(req.body);
      if (error) return res.status(400).json({ message: error.details[0].message });

      const result = await Result.findById(req.params.id);
      if (!result) return res.status(404).json({ message: "Result not found" });

      const { marksObtained, semester, year } = req.body;

      if (marksObtained !== undefined) result.marksObtained = marksObtained;
      if (semester) result.semester = semester;
      if (year) result.year = year;

      await result.save();

      res.status(200).json({ message: "Result updated successfully", result });

    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };

  // ================= DELETE RESULT =================
  static deleteResult = async (req, res) => {
    const result = await Result.findById(req.params.id);
    if (!result) return res.status(404).json({ message: "Result not found" });

    await Result.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Result deleted successfully" });
  };
}

module.exports = ResultController;
