const mongoose = require("mongoose");
const { Schema } = mongoose;
const CategorySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
    },
    category: {
      type: String,
      default: "Uncatigorized",
    },
    // numOfPosts: {
    //   type: Number,
    //   required: true
    // }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Categorie", CategorySchema);
