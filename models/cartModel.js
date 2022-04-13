// review / rating / createdAt / ref to tour / ref to user
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Cart must belong to a product."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Cart must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

cartSchema.index({ product: 1, user: 1 }, { unique: true });

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "product",
    // select: "name imageCover priceSale priceOriginal",
  });
  next();
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
