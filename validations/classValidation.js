const Joi = require("joi");

exports.addClassValidation = Joi.object({
  course: Joi.string().valid("BTECH", "BCA", "MBA", "BBA").required(),
  semester: Joi.number().min(1).max(8).required()
});

exports.updateClassValidation = Joi.object({
  course: Joi.string().valid("BTECH", "BCA", "MBA", "BBA").optional(),
  semester: Joi.number().min(1).max(8).optional()
});
