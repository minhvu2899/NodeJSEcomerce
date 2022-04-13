const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        product_name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],
    orderTracks: [
      {
        status: {
          type: String,
          enum: [
            "NEW",
            "IN_PROGRESS",
            "PICKED",
            "PACKAGED",
            "DELIVERED",
            "CANCEL",
          ],
          default: "NEW",
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },
        description: {
          type: String,
          required: true,
          default: "Đơn hàng được đặt thành công",
        },
      },
    ],

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Order must belong to a User!"],
    },

    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true },
      ward: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    name_customer: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    total: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    orderStatus: {
      type: String,
      enum: ["NEW", "IN_PROGRESS", "PICKED", "PACKAGED", "DELIVERED", "CANCEL"],
      default: "NEW",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// orderSchema.pre(/^find/, function (next) {
//   this.populate("user").populate({
//     path: "orderItem",
//     select: "name",
//   });
//   next();
// });
orderSchema.virtual("total_cost").get(function () {
  return this.shippingPrice;
});
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
