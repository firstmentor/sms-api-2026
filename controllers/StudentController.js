const Student = require("../models/Student");
const User = require("../models/User");
const Class = require("../models/Class");
const bcrypt = require("bcrypt");
const {
  addStudentValidation,
  updateStudentValidation
} = require("../validations/studentValidation");

class StudentController {

  // ================= ADD STUDENT =================
  static addStudent = async (req, res) => {
    try {
      console.log(req.body)
      const { error } = addStudentValidation.validate(req.body);
      if (error)
        return res.status(400).json({ message: error.details[0].message });

      const { name, rollNo, classId, year, password, email } = req.body;

      // duplicate roll
      if (await Student.findOne({ rollNo }))
        return res.status(400).json({ message: "Roll number already exists" });

      // class check
      if (!await Class.findById(classId))
        return res.status(404).json({ message: "Class not found" });

      const studentEmail = email || `${rollNo}@college.com`;

      if (await User.findOne({ email: studentEmail }))
        return res.status(400).json({ message: "Email already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);

      // create user
      const user = await User.create({
        name,
        email: studentEmail,
        password: hashedPassword,
        // role: "student"
      });

      // create student
      const student = await Student.create({
        user: user._id,
        rollNo,
        class: classId,
        year
      });

      res.status(201).json({
        message: "Student added successfully",
        student
      });

    } catch (err) {
      console.log(err)
      res.status(500).json({ message: "Server error" });
    }
  };

  // ================= GET ALL STUDENTS =================
  static getAllStudents = async (req, res) => {
    const students = await Student.find()
      .populate("user", "name email")
      .populate("class", "course semester");

    res.status(200).json(students);
  };

  // ================= GET STUDENT BY ID =================
  static getStudentById = async (req, res) => {
    const student = await Student.findById(req.params.id)
      .populate("user", "name email")
      .populate("class", "course semester");

    if (!student)
      return res.status(404).json({ message: "Student not found" });

    res.status(200).json(student);
  };

  // ================= UPDATE STUDENT =================
  static updateStudent = async (req, res) => {
    try {
      console.log(req.body)
      const { error } = updateStudentValidation.validate(req.body);
      if (error)
        return res.status(400).json({ message: error.details[0].message });

      const student = await Student.findById(req.params.id);
      if (!student)
        return res.status(404).json({ message: "Student not found" });

      const user = await User.findById(student.user);

      const { name, rollNo, classId, year, password, email } = req.body;

      // name update
      if (name) user.name = name;

      // rollNo update
      if (rollNo && rollNo !== student.rollNo) {
        if (await Student.findOne({ rollNo }))
          return res.status(400).json({ message: "Roll number already exists" });

        student.rollNo = rollNo;

        // auto email update if manual email not provided
        user.email = email || `${rollNo}@college.com`;
      }

      // manual email update
      if (email && email !== user.email) {
        if (await User.findOne({ email }))
          return res.status(400).json({ message: "Email already exists" });

        user.email = email;
      }

      if (password)
        user.password = await bcrypt.hash(password, 10);

      if (classId) student.class = classId;
      if (year) student.year = year;

      await user.save();
      await student.save();

      res.status(200).json({ message: "Student updated successfully" });

    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  };

  // ================= DELETE STUDENT =================
  static deleteStudent = async (req, res) => {
    const student = await Student.findById(req.params.id);
    if (!student)
      return res.status(404).json({ message: "Student not found" });

    await User.findByIdAndDelete(student.user);
    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Student deleted successfully" });
  };
}

module.exports = StudentController;
