const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");

// Register a User
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  sendToken(user, 201, res);
});

// Login User
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

// Logout User
exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
    error: "",
  });
});

//Get user Detail --Profile
exports.getUserDetail = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.Id);
  if (!user) {
    return next(new ErrorHandler("No user found(Invalid userID)", 404));
  }

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    message: "Success",
    error: "",
  });
});

//Change Role
exports.changeRole = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.Id);
  if (!user) {
    return next(new ErrorHandler("No user found(Invalid userID)", 404));
  }

  if (user.role === "EMPLOYEE") {
    user.role = "ADMIN";
  } else {
    user.role = "EMPLOYEE";
  }
  await user.save({ validateBeforeSave: false });
  return res.status(200).json({
    success: true,
    message: `User role changed to: ${user.role}`,
    error: "",
  });
});
