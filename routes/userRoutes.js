const express = require("express");

const {
  loginUser,
  registerUser,
  logoutUser,
  getUserDetail,
  changeRole,
} = require("../controllers/userController");
const { ValidateUser } = require("../validations/userValidation");

const { throwError } = require("../utils/helper");
const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(ValidateUser("signupUser"), throwError,registerUser);

router.route("/login").post(ValidateUser("signinUser"), throwError,loginUser);

router.route("/logout").get(isAuthenticatedUser, logoutUser);

router
  .route("/details/:Id")
  .get(isAuthenticatedUser, getUserDetail)
  .put(isAuthenticatedUser,authorizeRoles("ADMIN"), changeRole);

module.exports = router;
