const Joi = require('joi');

const createTimelineSchema = Joi.object({
  member_id: Joi.number().integer().required(),
  title: Joi.string().min(2).max(300).required(),
  title_ml: Joi.string().max(300).allow('', null),
  description: Joi.string().allow('', null),
  description_ml: Joi.string().allow('', null),
  event_date: Joi.date().allow(null, ''),
  event_year: Joi.number().integer().min(1800).max(2100).allow(null),
  event_type: Joi.string().valid(
    'birth', 'marriage', 'career', 'education', 'award',
    'retirement', 'death', 'milestone', 'other'
  ).required(),
  is_featured: Joi.boolean().default(false),
});

const updateTimelineSchema = Joi.object({
  title: Joi.string().min(2).max(300),
  title_ml: Joi.string().max(300).allow('', null),
  description: Joi.string().allow('', null),
  description_ml: Joi.string().allow('', null),
  event_date: Joi.date().allow(null, ''),
  event_year: Joi.number().integer().min(1800).max(2100).allow(null),
  event_type: Joi.string().valid(
    'birth', 'marriage', 'career', 'education', 'award',
    'retirement', 'death', 'milestone', 'other'
  ),
  is_featured: Joi.boolean(),
}).min(1);

module.exports = { createTimelineSchema, updateTimelineSchema };
