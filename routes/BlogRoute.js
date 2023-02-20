const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const Blog = require("../models/BlogModel");
const User = require("../models/UserModel");
const multer = require("multer");
const fetchUser = require("../middleware/fetchUser");
const fs = require("fs");
const { findByIdAndDelete } = require("../models/UserModel");

// Storage
const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: Storage,
});

// Create Blog - Login Required
router.post(
  "/create",
  fetchUser,
  [
    body("title", "Title is required").isLength({ min: 3 }),
    body("description", "Description is required").isLength({ min: 5 }),
  ],
  upload.single("feature_image"),
  async (req, res) => {
    try {
      const errors = validationResult(body);
      if (!errors.isEmpty()) {
        return res
          .status(500)
          .send({ success: false, message: "Internal server error" });
      }
      const { title, description, category, tags } = req.body;
      let blog = await Blog.findOne({ title });
      if (blog) {
        return res
          .status(402)
          .send({ success: false, message: "Blog already exists" });
      }
      const username = await User.findById(req.user.id);
      blog = await Blog.create({
        user: req.user.id,
        title,
        description,
        category,
        featureImg: {
          data: fs.readFileSync("uploads/" + req.file.filename),
          contentType: "image/png",
        },
        authorName: username.name,
      });
      return res.status(201).send({ success: true, blog });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ success: false, message: "Internal server error." });
    }
  }
);

// Get all blogs - Login Required
router.get("/all-blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    return res.status(200).send({ success: true, blogs, total: blogs.length });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
});

router.get("/single/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    return res.status(200).send({ success: true, blog });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
});

router.delete("/delete/:id", fetchUser, async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).send({
        success: false,
        message:
          "No blog found with ID: " +
          req.params.id.slice(0, 4) +
          "..." +
          req.params.id.slice(req.params.id.length - 4),
      });
    }
    blog = await Blog.findByIdAndDelete(req.params.id);
    return res.status(201).send({
      success: true,
      message:
        "Blog has been deleted with ID: " +
        req.params.id.slice(0, 4) +
        "..." +
        req.params.id.slice(req.params.id.length - 4),
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
