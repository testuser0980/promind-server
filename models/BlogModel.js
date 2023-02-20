const mongoose = require("mongoose");
const { Schema } = mongoose;
const BlogSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "Uncatigorized",
    },
    description: {
      type: String,
      required: true,
    },
    featureImg: {
      data: Buffer,
      contentType: String,
    },
    authorName: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);
