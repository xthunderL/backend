const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

//models for Imgpath
const Imgpath = require("./api/models/image");

const imageRoutes = require("./api/routes/images");
//const orderRoutes = require("./api/routes/orders");

//model for user
const userRoutes = require("./api/routes/user");

const mongoose = require("mongoose");

//username:dip
//password:gy4KDFopl4A7Fw44
const mongoString =
  "mongodb+srv://dip:gy4KDFopl4A7Fw44@cluster0.win9w.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoString, { useNewUrlParser: true });

mongoose.connection.on("error", function (error) {
  console.log(error);
});
//using the js promise.
mongoose.Promise = global.Promise;

mongoose.connection.on("open", function () {
  console.log("Connected to MongoDB database.");
});

app.use(morgan("dev"));
app.use(express.static("/images"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/images", imageRoutes);
//app.use("/orders", orderRoutes);

app.use("/user", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
