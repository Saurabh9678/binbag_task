const Reimbursement = require("../models/reimbursementModel");
const ErrorHandler = require("../utils/errorhandler");
const { api } = require("../utils/helper");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");

exports.createReimbursement = catchAsyncError(async (req, res, next) => {
  const { reason } = req.body;
  const user = req.user;
  const currentTimestamp = new Date();
  const reimbursement = await Reimbursement.create({
    user: user._id,
    reason,
    raisedAt: currentTimestamp,
  });
  const data = {
    reimbursementId: reimbursement._id,
    user: {
      _id: user._id,
      name: user.name,
    },
    reason: reimbursement.reason,
    status: reimbursement.status,
    raisedAt: new Date(reimbursement.raisedAt).toLocaleString(),
  };
  return api(200, res, data, "Reimbursement Created");
});

exports.getReimbursementRequest = catchAsyncError(async (req, res, next) => {
  let query = {};

  if (req.query) {
    const { name, status } = req.query;

    if (name && status) {
      const users = await User.find({
        name: { $regex: new RegExp(name, "i") },
      });
      if (!users || users.length === 0) {
        return next(new ErrorHandler("User not found", 404));
      }

      query.user = { $in: users.map((user) => user._id) };
      query.status = { $regex: new RegExp(status, "i") };
    } else if (name || status) {
      if (name) {
        const users = await User.find({
          name: { $regex: new RegExp(name, "i") },
        });
        if (!users || users.length === 0) {
          return next(new ErrorHandler("User not found", 404));
        }

        query.user = { $in: users.map((user) => user._id) };
      } else
        query.status = status ? { $regex: new RegExp(status, "i") } : undefined;
    }
  }

  const reimbursementRequests = await Reimbursement.find(query)
    .populate("user", "name")
    .exec();

  const formattedRequests = reimbursementRequests.map((request) => ({
    reimbursementId: request._id,
    user: {
      _id: request.user._id,
      name: request.user.name,
    },
    reason: request.reason,
    status: request.status,
    raisedAt: new Date(request.raisedAt).toLocaleString(),
  }));

  return api(200, res, formattedRequests, "Reimbursement Requests");
});

exports.setStatusOfReimbursement = catchAsyncError(async (req, res, next) => {
  const { status } = req.body;
  const { Id } = req.params;
  const reimbursement = await Reimbursement.findById(Id)
    .populate("user", "name")
    .exec();
  if (status === true) {
    reimbursement.status = "ACCEPTED";
  } else if (status === false) {
    reimbursement.status = "REJECTED";
  } else {
    return next(new ErrorHandler("Invalid Request", 400));
  }
  await reimbursement.save({ validateBeforeSave: true });
  const data = {
    reimbursementId: reimbursement._id,
    user: {
      _id: reimbursement.user._id,
      name: reimbursement.user.name,
    },
    reason: reimbursement.reason,
    status: reimbursement.status,
    raisedAt: new Date(reimbursement.raisedAt).toLocaleString(),
  };
  return api(200, res, data, "Reimbursement status updated");
});
