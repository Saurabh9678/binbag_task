const { body } = require("express-validator");
const User = require("../models/userModel");
const {err_Code} = require("../utils/constants")
exports.ValidateUser = (reqType) => {
  switch (reqType) {
    case "signupUser": {
      return [
        body("name")
          .isLength({ min: 2 })
          .withMessage({
            message: "Name must be at least 2 characters long",
            code: err_Code.INVALID_INPUT,
          })
          .bail(),
        body("email")
          .notEmpty()
          .withMessage({
            message: "Please enter email",
            code: err_Code.INVALID_INPUT,
          })
          .bail()
          .toLowerCase()
          .isEmail()
          .withMessage({
            message: "Please provide a valid email address.",
            code: err_Code.INVALID_INPUT,
          })
          .bail()
          .custom(async (value) => {
            return User.findOne({ email: value }).then((user) => {
              if (user) {
                return Promise.reject({
                  message: "User with this email address already exists.",
                  code: err_Code.RESOURCE_EXISTS,
                });
              }
            });
          }),
        body("password")
          .isLength({ min: 6 })
          .withMessage({
            message: "Password should be at least 6 characters.",
            code: err_Code.INVALID_INPUT,
          })
          .bail()
          .custom((value) => {
            if (!/[a-z]/.test(value) || !/[A-Z]/.test(value)) {
              return Promise.reject({
                message: "Password should contain lower and uppercase characters.",
                code: err_Code.INVALID_INPUT,
              });
            }
            return true;
          }),
      ];
    }

    case "signinUser": {
      return [
        body("email")
          .notEmpty()
          .withMessage({
            message: "Please enter email",
            code: err_Code.INVALID_INPUT,
          })
          .bail()
          .toLowerCase()
          .isEmail()
          .withMessage({
            message: "Please provide a valid email address.",
            code: err_Code.INVALID_INPUT,
          })
          .bail(),
        body("password")
          .notEmpty()
          .withMessage({
            message: "Please enter password",
            code: err_Code.INVALID_INPUT,
          })
          .bail(),
      ];
    }
  }
};
