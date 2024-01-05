const { body } = require("express-validator");

const {err_Code} = require("../utils/constants")
exports.ValidateReimbursement = (reqType) => {
  switch (reqType) {
    case "create": {
      return [
        body("reason")
          .isLength({ min: 5 })
          .withMessage({
            message: "Reason must be at least 5 characters long",
            code: err_Code.INVALID_INPUT,
          })
          .bail(),
      ];
    }
  }
};
