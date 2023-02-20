const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/UserModel");
const router = express.Router();
// const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SEC = "promind__@&12fgeap!*ald";
const fetchUser = require("../middleware/fetchUser");

// // Create Storage
// const Storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({
//   storage: Storage,
// });

// Create User
router.post(
  "/create/admin",
  [
    body("name", "Name is required").isLength({ min: 3 }),
    body("email", "Email is required").isEmail(),
    body("password", "Password is required").isLength({ min: 5 }),
  ],
  // upload.single("profile"),
  async (req, res) => {
    try {
      const errors = validationResult(body);
      if (!errors.isEmpty()) {
        return res.status(401).send({ success: false, errors: errors.array() });
      }
      const { name, email, password, role, userProfileName } = req.body;
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(402)
          .send({ success: false, message: "User already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const SEC_PASS = await bcrypt.hash(password, salt);
      user = await User.create({
        name,
        email,
        password: SEC_PASS,
        role,
        // userProfileName,
        // userProfile: {
        //   data: req.file.filename,
        //   contentType: "image/png",
        // },
      });
      return res.status(201).send({
        success: true,
        message: "User has been created successfully.",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ success: false, message: "Internal server error." });
    }
  }
);

// Login User
router.post(
  "/login",
  [
    body("email", "Email is required").isEmail(),
    body("password", "Password is required").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(body);
      if (!errors.isEmpty()) {
        return res.status(402).send({ success: false, errors: errors.array() });
      }
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(402)
          .send({ success: false, message: "Wrong credientials" });
      }
      const compare_password = await bcrypt.compare(password, user.password);
      if (!compare_password) {
        return res
          .status(402)
          .send({ success: false, message: "Wrong credientials" });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(payload, JWT_SEC);
      return res.status(200).send({ success: true, authToken });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ success: false, message: "Internal server error" });
    }
  }
);

// Get Single User Details - Login Required
router.post("/user/:id", fetchUser, async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ success: false, message: "No user found" });
    }
    if (user.id.toString() !== req.user.id) {
      return res.status(402).send({ success: false, message: "Not allowed" });
    }
    return res.status(200).send({ success: true, user });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
});

// Get all Users - Login Required
router.get("/all-users", fetchUser, async (req, res) => {
  try {
    let all_users = await User.findById(req.user.id);
    if (all_users.role !== "admin") {
      return res.status(402).send({ success: true, message: "Not allowed" });
    }
    all_users = await User.find();
    return res.status(200).send({ success: true, all_users });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
