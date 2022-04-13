// category / slug / createdAt / description /
const mongoose = require("mongoose");
const slugify = require("slugify");
const addressSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên không được để trống!"],
    },
    phone: {
      type: String,
      required: [true, "Số điện thoại không để trống!"],
    },
    ward: {
      type: String,
      required: [true, "Tên phường xã không trống!"],
    },
    district: {
      type: String,
      required: [true, "Tên quận huyện không trống!"],
    },
    city: {
      type: String,
      required: [true, "Tên tỉnh thành phố không trống!"],
    },
    address: {
      type: String,
      // required: [true, "Name category can not be empty!"],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Address must belong to a user"],
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

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
