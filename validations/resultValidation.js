const Joi = require("joi");

exports.addResultValidation = Joi.object({
  studentId: Joi.string().required(),
  subjectId: Joi.string().required(),
  marksObtained: Joi.number().min(0).max(100).required(),
  semester: Joi.number().min(1).max(8).required(),
  year: Joi.number().min(2020).max(2030).required()
});

exports.updateResultValidation = Joi.object({
  marksObtained: Joi.number().min(0).max(100).optional(),
  semester: Joi.number().min(1).max(8).optional(),
  year: Joi.number().min(2020).max(2030).optional()
});
