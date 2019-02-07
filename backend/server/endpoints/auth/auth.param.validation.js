import Joi from "joi";

// POST /auth/login
export const loginScheme = {
  body: {
    username: Joi.string().required(),
    password: Joi.string().required()
  }
};

// POST /auth/register
export const registerScheme = {
  body: {
    username: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().required(),
    affiliation: Joi.string().required(),
    identification: Joi.string().required()
  }
};

// POST /auth/update/:id
export const updateUserScheme = {
  body: {
    username: Joi.string().required(),
    password: Joi.string().required(),
    enrollmentSecret: Joi.string().required()
  },
  params: {
    userId: Joi.string()
      .hex()
      .required()
  }
};
