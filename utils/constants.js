require("dotenv").config();

const err_Code = {
  INVALID_INPUT: "INVALID_INPUT",
  RESOURCE_EXISTS: "RESOURCE_EXISTS",
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
  NOT_SIGNEDIN: "NOT_SIGNEDIN",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  NOT_ALLOWED_ACCESS: "NOT_ALLOWED_ACCESS",
};

const env = {
  DB_URI: process.env.DB_URI,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE,
  COOKIE_EXPIRE: process.env.COOKIE_EXPIRE,
};

module.exports = {
  err_Code,
  env,
};
