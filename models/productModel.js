const mongoose = require("mongoose");
const slugify = require("slugify");
// const User = require('./userModel');
// const validator = require('validator');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      text: true,
      required: [true, "A product must have a name"],
      unique: true,
      trim: true,
      maxlength: [
        100,
        "A product name must have less or equal then 100 characters",
      ],
      minlength: [
        10,
        "A product name must have more or equal then 10 characters",
      ],
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    countInStock: {
      type: Number,
      default: 0,
      //   required: [true, "A tour must have a group size"],
    },
    // difficulty: {
    //   type: String,
    //   required: [true, "A tour must have a difficulty"],
    //   enum: {
    //     values: ["easy", "medium", "difficult"],
    //     message: "Difficulty is either: easy, medium, difficult",
    //   },
    // },
    isActive: {
      type: Boolean,
      default: true,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [0, "Rating must be above 0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceOriginal: {
      type: Number,
      required: [true, "A product must have a price"],
    },
    priceSale: {
      type: Number,
      required: [true, "A product must have a price"],
      default: 300,
    },
    description: {
      type: String,
      trim: true,
      text: true,
      required: [true, "A product must have a description"],
    },
    // imageCover: {
    //   type: String,
    //   required: [true, "A product must have a cover image"],
    // },
    imageCover: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    sold: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
    },
    subcategory: {
      type: mongoose.Schema.ObjectId,
      ref: "SubCategory",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// tourSchema.index({ price: 1 });
productSchema.index({ price: 1, ratingsAverage: -1 });
productSchema.index({ slug: 1 });
productSchema.virtual("isPromotion").get(function () {
  return this.discountPercent > 0;
});
productSchema.virtual("discount").get(function () {
  return this.priceOriginal - this.priceSale;
});
productSchema.virtual("discountPercent").get(function () {
  const rate = 100 * (this.priceSale / this.priceOriginal);
  return 100 - rate.toFixed();
});

// Virtual populate
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name slug",
  });

  next();
});
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "subcategory",
    select: "name slug",
  });

  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
