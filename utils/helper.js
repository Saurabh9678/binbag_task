const { validationResult } = require("express-validator");

const throwError = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      param: error.path,
      message: error.msg.message,
      code: error.msg.code,
    }));

    res.status(400).json({ status: false, errors: formattedErrors });
  } else {
    next();
  }
};

function api(statusCode, response, data, message) {
  return response.status(statusCode).json({
    success: true,
    data: data,
    message: message,
    error: null,
  });
}

module.exports = { api, throwError };
