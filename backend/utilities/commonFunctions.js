const { commonErrorHandler } = require('./errorHandler');

const validateRequest = (req, res, next, schema, requestParameterType) => {
  const options = {
    abortEarly: true, // include all errors
    allowUnknown: false, // ignore unknown props
    stripUnknown: true, // remove unknown props
  };

  let requestData = {};
  if (requestParameterType === 'body') {
    requestData = req.body;
  } else if (requestParameterType === 'query') {
    requestData = req.query;
  } else {
    requestData = req.params;
  }

  const { error, value } = schema.validate(requestData, options);

  if (!error) {
    if (requestParameterType === 'body') {
      req.body = value;
    } else if (requestParameterType === 'query') {
      req.query = value;
    } else {
      req.params = value;
    }
    return next();
  }

  const { details } = error;
  const message = details.map((i) => i.message).join(',');

  return commonErrorHandler(req, res, message, 422);
};

module.exports = {
  validateRequest,
};
