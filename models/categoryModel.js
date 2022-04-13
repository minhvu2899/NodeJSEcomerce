// category / slug / createdAt / description /
const mongoose = require("mongoose");
const slugify = require("slugify");
const categorySchema = new mongoose.Schema(
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
categorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
