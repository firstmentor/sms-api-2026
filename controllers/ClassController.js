const Class = require("../models/Class");
const {
  addClassValidation,
  updateClassValidation
} = require("../validations/classValidation");

class ClassController {

  // ✅ ADD CLASS
  static addClass = async (req, res) => {
    try {
      const { error } = addClassValidation.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { course, semester } = req.body;

      const existClass = await Class.findOne({ course, semester });
      if (existClass) {
        return res.status(400).json({ message: "Class already exists" });
      }

      const newClass = await Class.create({ course, semester });

      res.status(201).json({
        message: "Class added successfully",
        class: newClass
      });

    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  // ✅ GET ALL CLASSES
  static getAllClasses = async (req, res) => {
    try {
      const classes = await Class.find().sort({ course: 1, semester: 1 });
      res.status(200).json(classes);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  // ✅ GET SINGLE CLASS
  static getClassById = async (req, res) => {
    try {
      const classData = await Class.findById(req.params.id);
      if (!classData) {
        return res.status(404).json({ message: "Class not found" });
      }
      res.status(200).json(classData);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  // ✅ UPDATE CLASS
  static updateClass = async (req, res) => {
    try {
      const { error } = updateClassValidation.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { course, semester } = req.body;

      const classData = await Class.findById(req.params.id);
      if (!classData) {
        return res.status(404).json({ message: "Class not found" });
      }

      if (course) classData.course = course;
      if (semester) classData.semester = semester;

      await classData.save();

      res.status(200).json({
        message: "Class updated successfully",
        class: classData
      });

    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  // ✅ DELETE CLASS
  static deleteClass = async (req, res) => {
    try {
      const classData = await Class.findById(req.params.id);
      if (!classData) {
        return res.status(404).json({ message: "Class not found" });
      }

      await Class.findByIdAndDelete(req.params.id);

      res.status(200).json({ message: "Class deleted successfully" });

    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
}

module.exports = ClassController;
