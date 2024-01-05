const express = require("express");
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Request-Headers", "https");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-api-key"
  );
  next();
});

//Route Imports
const userRoutes = require("./routes/userRoutes");
const reimbursementRoutes = require("./routes/reimbursementRoutes");

//Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/reimbursement", reimbursementRoutes);

// MiddleWare for Error

app.use(errorMiddleware);

module.exports = app;
