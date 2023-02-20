const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Category = require("../models/CategoriesModel");
const Posts = require('../models/BlogModel')

router.post("/create-category", fetchUser, async (req, res) => {
  try {
    const { category } = req.body;
    let categories = await Category.findOne({ category });
    if (categories) {
      return res
      .status(400)
      .send({ success: false, message: "Category already exists." });
    }
    categories = await Category.create({
      user: req.user.id,
      category,
    });
    return res.status(201).send({ success: true, categories });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error." });
  }
});

router.get("/all-categories", async (req, res) => {
  try {
    const categories = await Category.find();
    return res
      .status(200)
      .send({ success: true, categories, total: categories.length });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error." });
  }
});

module.exports = router;
