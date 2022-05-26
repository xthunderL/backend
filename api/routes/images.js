const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const image = require("../models/image");
const Image = require("../models/image");

const multer = require("multer");
const path = require("path");
const { response } = require("express");

const storage1 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../../images");
  },
  filename(req, file, cb) {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

//C-/Users/Dipesh_TD/OneDrive/Documents/node-restful-api-tutorial-04-request-body-and-cors/uploads/
const stor = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: stor,
});

router.get("/", (req, res, next) => {
  image
    .find()
    .select("name path")
    .exec()
    .then((docs) => {
      var response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            Image: doc.path,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    });
  //   if (docs.length >= 0) {
});

router.post("/", upload.single("image"), (req, res, next) => {
  console.log(req.file.path);
  const newImage = new Image({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    path: {
      data: req.file.filename,
      contentType: "image/png",
    },
  });
  // const image = new Image({
  //   _id: new mongoose.Types.ObjectId(),
  //   name: req.body.name,
  //   path: req.file.path,
  // });

  newImage
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Image Created successfully",
        createdImage: {
          name: result.name,
          path: result.path,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/images/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:imageId", (req, res, next) => {
  const id = req.params.imageId;

  image
    .findById(id)
    .select("name path")
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          ImageDetail: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/products",
          },
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:imageId", upload.single("image"), (req, res, next) => {
  const id = req.params.imageId;
  // const updateOps = {};
  // for (const ops of req.body) {
  //   updateOps[ops.propName] = ops.value;
  // }
  image
    .updateOne(
      { _id: id },
      { $set: { name: req.body.name, path: req.file.fieldname } }
    )
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Image Deatail updated",
        output: result,
        request: {
          type: "GET",
          url: "http://localhost:3000/image/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:imageId", (req, res, next) => {
  const id = req.params.imageId;
  image
    .remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Image deleted",
        request: {
          type: "POST",
          output: result,
          url: "http://localhost:3000/images",
          body: { name: result.name, Image: result.path },
        },
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
