const Result = require("../models/Result");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const Joi = require("joi");

/* ================= VALIDATION ================= */
const addBulkResultValidation = Joi.object({
  studentId: Joi.string().required(),
  semester: Joi.number().min(1).max(8).required(),
  year: Joi.number().min(2020).max(2030).required(),
  marks: Joi.array()
    .items(
      Joi.object({
        subjectId: Joi.string().required(),
        marksObtained: Joi.number().min(0).required()
      })
    )
    .min(1)
    .required()
});

/* ================= CONTROLLER ================= */
class ResultController {

  // ✅ ADMIN → ADD RESULT (MULTIPLE SUBJECTS)
  static addBulkResult = async (req, res) => {
    try {
      const { error } = addBulkResultValidation.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { studentId, semester, year, marks } = req.body;

      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      let savedResults = [];
      let skippedSubjects = [];

      for (let item of marks) {

        const subject = await Subject.findById(item.subjectId);
        if (!subject) {
          skippedSubjects.push({
            subjectId: item.subjectId,
            reason: "Subject not found"
          });
          continue;
        }

        const alreadyExists = await Result.findOne({
          student: studentId,
          subject: item.subjectId,
          semester,
          year
        });

        if (alreadyExists) {
          skippedSubjects.push({
            subject: subject.name,
            reason: "Result already exists"
          });
          continue;
        }

        const percentage = Number(
          ((item.marksObtained / subject.maxMarks) * 100).toFixed(2)
        );

        let grade = "F";
        if (percentage >= 90) grade = "A+";
        else if (percentage >= 80) grade = "A";
        else if (percentage >= 70) grade = "B";
        else if (percentage >= 60) grade = "C";
        else if (percentage >= 50) grade = "D";

        const result = await Result.create({
          student: studentId,
          subject: item.subjectId,
          semester,
          year,
          marksObtained: item.marksObtained,
          totalMarks: subject.maxMarks,
          percentage,
          grade
        });

        savedResults.push(result);
      }

      const populatedResults = await Result.find({
        _id: { $in: savedResults.map(r => r._id) }
      })
        .populate("student", "rollNo")
        .populate("subject", "name");

      res.status(201).json({
        message: "Result declared successfully",
        totalSubjects: marks.length,
        savedCount: savedResults.length,
        skipped: skippedSubjects,
        results: populatedResults
      });

    } catch (error) {

      // Handle unique index duplicate error
      if (error.code === 11000) {
        return res.status(400).json({
          message: "Duplicate result entry"
        });
      }

      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };


  static allResult = async (req, res) => {
    try {
      const results = await Result.find()
        .populate({
          path: "student",
          populate: {
            path: "user",
            select: "name email"
          }
        })
        .populate("subject");

      res.status(200).json(results);

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // GET Logged In Student Result
  // GET MY RESULT
 static getMyResult = async (req, res) => {
  try {

    // logged in user id from JWT
    const userId = req.user.id;

    // find student by user id
    const student = await Student.findOne({ user: userId })
      .populate("user", "name email")
      .populate("class", "name");   // 🔥 class name yaha se aa jayega

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // find results
    const results = await Result.find({ student: student._id })
      .populate("subject", "name code");

    res.status(200).json({
      student,
      results
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
}

module.exports = ResultController;
