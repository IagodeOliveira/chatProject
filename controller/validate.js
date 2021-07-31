const Joi = require("joi");

const registerValidate = (data) => {
  const schema = Joi.object({
    username: Joi.string().required().min(3).max(50),
    password: Joi.string().required().min(6).max(100),
  });
  return schema.validate(data);
};

const loginValidate = (data) => {
  const schema = Joi.object({
    username: Joi.string().required().min(3).max(50),
    password: Joi.string().required().min(6).max(100),
    room: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports.registerValidate = registerValidate;
module.exports.loginValidate = loginValidate;
