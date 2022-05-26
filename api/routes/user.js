const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/user");
const jwt = require("jsonwebtoken");

router.post("/signup", (req, res, next) => {
  User.find({ contact: req.body.contact })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Contact already exists!!,try with different contact number",
        });
      } else {
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          contact: req.body.contact,
        });
        user
          .save()
          .then((result) => {
            console.log(result);
            res.status(201).json({
              message: "User created with Contact info",
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: err,
            });
          });
      }
    });
});

router.post("/login", (req, res, next) => {
  User.find({ contact: req.body.contact })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed !!",
        });
      }
      let result = true;

      if (result) {
        const token = jwt.sign(
          {
            contact: user[0].contact,
            userId: user[0]._id,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "1h",
          }
        );
        return res.status(200).json({
          message: "Auth successful",
          token: token,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:userId", (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
