import { badRequestError } from '../errors/index.js';

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      throw new badRequestError(error.details[0].message);
    }
    req.body = value;
    next();
  };
};

export default validate;
