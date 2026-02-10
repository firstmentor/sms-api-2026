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
      /* 1️⃣ Validate request */
      const { error } = addBulkResultValidation.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { studentId, semester, year, marks } = req.body;

      /* 2️⃣ Check student exists */
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      let savedResults = [];
      let skippedSubjects = [];

      /* 3️⃣ Loop subjects */
      for (let item of marks) {

        const subject = await Subject.findById(item.subjectId);
        if (!subject) {
          skippedSubjects.push({
            subjectId: item.subjectId,
            reason: "Subject not found"
          });
          continue;
        }

        /* 4️⃣ Prevent duplicate result */
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

        /* 5️⃣ Calculate percentage & grade */
        const percentage = (item.marksObtained / subject.maxMarks) * 100;

        let grade = "F";
        if (percentage >= 90) grade = "A+";
        else if (percentage >= 80) grade = "A";
        else if (percentage >= 70) grade = "B";
        else if (percentage >= 60) grade = "C";
        else if (percentage >= 50) grade = "D";

        /* 6️⃣ Save result */
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

      /* 7️⃣ Response */
      res.status(201).json({
        message: "Result declared successfully",
        totalSubjects: marks.length,
        savedCount: savedResults.length,
        skipped: skippedSubjects,
        results: savedResults
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
}

module.exports = ResultController;
