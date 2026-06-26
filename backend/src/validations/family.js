const Joi = require('joi');

const createFamilySchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  name_ml: Joi.string().max(200).allow('', null),
  description: Joi.string().max(1000).allow('', null),
  description_ml: Joi.string().max(1000).allow('', null),
  motto: Joi.string().max(500).allow('', null),
  motto_ml: Joi.string().max(500).allow('', null),
  is_active: Joi.boolean(),
});

const updateFamilySchema = Joi.object({
  name: Joi.string().min(2).max(200),
  name_ml: Joi.string().max(200).allow('', null),
  description: Joi.string().max(1000).allow('', null),
  description_ml: Joi.string().max(1000).allow('', null),
  motto: Joi.string().max(500).allow('', null),
  motto_ml: Joi.string().max(500).allow('', null),
  is_active: Joi.boolean(),
}).min(1);

module.exports = { createFamilySchema, updateFamilySchema };
