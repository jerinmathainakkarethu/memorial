const Joi = require('joi');

const createMemberSchema = Joi.object({
  family_id: Joi.number().integer().required(),
  full_name: Joi.string().min(2).max(200).required(),
  full_name_ml: Joi.string().max(200).allow('', null),
  nickname: Joi.string().max(100).allow('', null),
  nickname_ml: Joi.string().max(100).allow('', null),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  date_of_birth: Joi.date().allow(null, ''),
  date_of_death: Joi.date().allow(null, ''),
  place_of_birth: Joi.string().max(300).allow('', null),
  place_of_death: Joi.string().max(300).allow('', null),
  biography: Joi.string().allow('', null),
  biography_ml: Joi.string().allow('', null),
  occupation: Joi.string().max(300).allow('', null),
  occupation_ml: Joi.string().max(300).allow('', null),
  education: Joi.string().allow('', null),
  education_ml: Joi.string().allow('', null),
  awards: Joi.string().allow('', null),
  awards_ml: Joi.string().allow('', null),
  hobbies: Joi.string().allow('', null),
  hobbies_ml: Joi.string().allow('', null),
  religion: Joi.string().max(100).allow('', null),
  religion_ml: Joi.string().max(100).allow('', null),
  notes: Joi.string().allow('', null),
  notes_ml: Joi.string().allow('', null),
  is_deceased: Joi.boolean().default(false),
  is_active: Joi.boolean().default(true),
  relationships: Joi.array().items(
    Joi.object({
      related_member_id: Joi.number().integer().required(),
      relationship_type: Joi.string().valid(
        'father', 'mother', 'spouse', 'child', 'sibling',
        'grandfather', 'grandmother', 'grandchild',
        'uncle', 'aunt', 'cousin', 'other'
      ).required(),
    })
  ).default([]),
});

const updateMemberSchema = Joi.object({
  family_id: Joi.number().integer(),
  full_name: Joi.string().min(2).max(200),
  full_name_ml: Joi.string().max(200).allow('', null),
  nickname: Joi.string().max(100).allow('', null),
  nickname_ml: Joi.string().max(100).allow('', null),
  gender: Joi.string().valid('male', 'female', 'other'),
  date_of_birth: Joi.date().allow(null, ''),
  date_of_death: Joi.date().allow(null, ''),
  place_of_birth: Joi.string().max(300).allow('', null),
  place_of_death: Joi.string().max(300).allow('', null),
  biography: Joi.string().allow('', null),
  biography_ml: Joi.string().allow('', null),
  occupation: Joi.string().max(300).allow('', null),
  occupation_ml: Joi.string().max(300).allow('', null),
  education: Joi.string().allow('', null),
  education_ml: Joi.string().allow('', null),
  awards: Joi.string().allow('', null),
  awards_ml: Joi.string().allow('', null),
  hobbies: Joi.string().allow('', null),
  hobbies_ml: Joi.string().allow('', null),
  religion: Joi.string().max(100).allow('', null),
  religion_ml: Joi.string().max(100).allow('', null),
  notes: Joi.string().allow('', null),
  notes_ml: Joi.string().allow('', null),
  is_deceased: Joi.boolean(),
  is_active: Joi.boolean(),
  relationships: Joi.array().items(
    Joi.object({
      related_member_id: Joi.number().integer().required(),
      relationship_type: Joi.string().valid(
        'father', 'mother', 'spouse', 'child', 'sibling',
        'grandfather', 'grandmother', 'grandchild',
        'uncle', 'aunt', 'cousin', 'other'
      ).required(),
    })
  ),
}).min(1);

module.exports = { createMemberSchema, updateMemberSchema };
