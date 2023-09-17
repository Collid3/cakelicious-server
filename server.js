require("dotenv").config();
const express = require("express");
const app = express();
const auth = require("./routes/auth");
const signup = require("./routes/signup");
const logout = require("./routes/logout");
const refresh = require("./routes/refresh");
const getUser = require("./routes/getUser");
const sendEmail = require("./routes/sendEmail");
const cakes = require("./routes/admin/cakes");
const users = require("./routes/admin/users");
const mongoose = require("mongoose");
const connectDB = require("./config/connDB");
const verifyJWT = require("./middleware/verifyJWT");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const port = 3500;

// connect to database
connectDB();

// middlewares
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

// routes
app.use(auth);
app.use("/signup", signup);
app.use("/refresh", refresh);
app.use("/cakes", cakes);
app.use("/getUser", getUser);
app.use(logout);
app.use(verifyJWT);
app.use("/sendemail", sendEmail);
app.use("/users", users);

// connect to server
mongoose.connection.once("connected", () => {
  console.log("Connected to the database");
  app.listen(port, () => {
    console.log("Server running on port: ", port);
  });
});
