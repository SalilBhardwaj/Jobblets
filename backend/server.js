const express = require("express");
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8000;
app.use(morgan("dev"));
const connectDB = require("./utils/connection");
connectDB();

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const jobRouter = require("./routes/job");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

// app.use((req, res, next) => {
//   console.log(`${req.method} request to ${req.url}`);
//   next();
// });

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/job", jobRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
