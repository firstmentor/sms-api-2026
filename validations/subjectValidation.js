const Joi = require("joi");

exports.addSubjectValidation = Joi.object({
  classId: Joi.string().required(),
  name: Joi.string().min(3).required(),
  code: Joi.string().uppercase().required(),
  maxMarks: Joi.number().min(50).max(100).optional()
});

exports.updateSubjectValidation = Joi.object({
  name: Joi.string().min(3).optional(),
  code: Joi.string().uppercase().optional(),
  maxMarks: Joi.number().min(50).max(100).optional()
});
