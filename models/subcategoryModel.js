// category / slug / createdAt / description /
const mongoose = require("mongoose");
const slugify = require("slugify");
const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name category can not be empty!"],
    },
    slug: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must belong to a Category."],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  {
    timestamps: true,
  }
);

// categorySchema.index({ product: 1, user: 1 }, { unique: true });
subcategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
const SubCategory = mongoose.model("SubCategory", subcategorySchema);

module.exports = SubCategory;
