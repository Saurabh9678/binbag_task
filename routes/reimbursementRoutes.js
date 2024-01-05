const express = require("express");

const {
  createReimbursement,
  getReimbursementRequest,
  setStatusOfReimbursement,
} = require("../controllers/reimbursementController");
const {
  ValidateReimbursement,
} = require("../validations/reimbursementValidation");

const { throwError } = require("../utils/helper");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router
  .route("/")
  .post(
    ValidateReimbursement("create"),
    throwError,
    isAuthenticatedUser,
    createReimbursement
  )
  .get(isAuthenticatedUser, authorizeRoles("ADMIN"), getReimbursementRequest);

router
  .route("/:Id")
  .put(isAuthenticatedUser, authorizeRoles("ADMIN"), setStatusOfReimbursement);

module.exports = router;
