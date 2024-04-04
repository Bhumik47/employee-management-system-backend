const express = require("express");
const userRouter = require("./routes/user.js");
const departmentsRouter = require("./routes/department.rouets.js");

const { config } = require("dotenv");
const cookieParser = require("cookie-parser");
const { errorMiddleware } = require("./middlewares/error.js");
const cors = require("cors");
const { connectDB } = require("./data/database.js");

const app = express();
// env setup

config({
  path: "./data/config.env",
});

//middlewares
app.use(cookieParser());

app.use(express.json());
app.use(
  cors({
    origin:
      "http://localhost:5173" /* "https://employee-management-system-front.vercel.app/" */,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

//database connection
connectDB();

//using routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/departments", departmentsRouter);

app.get("/", (req, res) => {
  res.send("home");
});

//error middleware
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(
    `server is running on port ${process.env.PORT} in ${process.env.NODE_ENV} Mode`
  );
});
