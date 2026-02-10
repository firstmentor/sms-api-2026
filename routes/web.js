const express = require('express')
const AuthController = require('../controllers/AuthController')
const authMiddleware = require('../Middleware/authMiddleware')
const StudentController = require('../controllers/StudentController')
const ClassController = require('../controllers/ClassController')
const SubjectController = require('../controllers/SubjectController')

const route =express.Router()


route.post('/register',AuthController.register)
route.post("/login", AuthController.login);
route.post("/logout", AuthController.logout);
route.post("/change-password",authMiddleware,AuthController.changePassword);
route.get("/profile",authMiddleware,AuthController.profile);




//add student
route.post("/addStudent",authMiddleware,StudentController.addStudent);
route.get("/getAllStudents",authMiddleware,StudentController.getAllStudents);
route.get("/viewStudent/:id",authMiddleware,StudentController.getStudentById);
route.put("/updateStudent/:id",authMiddleware, StudentController.updateStudent);
route.delete("/deleteStudent/:id",authMiddleware, StudentController.deleteStudent);


// Admin only addClass
route.post("/addClass",authMiddleware,ClassController.addClass);
route.get("/allClass",authMiddleware,ClassController.getAllClasses);
route.get("/viewClass/:id",authMiddleware,ClassController.getClassById);
route.put("/updateClass/:id",authMiddleware,ClassController.updateClass);
route.delete("/deleteClass/:id",authMiddleware,ClassController.deleteClass);


//admin only Subject add
route.post("/add-subject",authMiddleware,SubjectController.addSubject);
route.get("/subjects",authMiddleware,SubjectController.getAllSubjects);
// // GET SUBJECTS BY CLASS
route.get("/subjects/class/:classId/",authMiddleware,SubjectController.getSubjectsByClass);
route.get("/subjects/:id",authMiddleware,SubjectController.getSubjectById);
route.put("/updateSubject/:id",authMiddleware,SubjectController.updateSubject);
route.delete("/deleteSubject/:id",authMiddleware,SubjectController.deleteSubject);
















module.exports =route