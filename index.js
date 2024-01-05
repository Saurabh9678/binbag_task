const app = require("./app");

const { env } = require("./utils/constants");
const connectDataBase = require("./database/database.js");

//Handling Uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught exception`);
  process.exit(1);
});



//Connecting to database
connectDataBase();

const port =env.PORT || 4000

const server = app.listen(port, () => {
  console.log(`Server is running in PORT:${port}`);
});

//Unhandled Promise rejections
//This may occur if we miss handle the connection strings

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise rejections`);

  server.close(() => {
    process.exit(1);
  });
});
