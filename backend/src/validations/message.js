const Joi = require('joi');

const createMessageSchema = Joi.object({
  visitor_name: Joi.string().min(1).max(200).required(),
  message: Joi.string().min(1).max(5000).required(),
});

const approveMessageSchema = Joi.object({
  is_approved: Joi.alternatives().try(Joi.boolean(), Joi.number().valid(0, 1)).required(),
});

module.exports = { createMessageSchema, approveMessageSchema };
