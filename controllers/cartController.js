const Cart = require("../models/cartModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");

exports.setProductUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllCartsByUser = catchAsync(async (req, res, next) => {
  let cart = await Cart.find({ user: req.user.id });
  res.status(201).json({
    status: "success",

    data: cart,
  });
});
exports.getCart = factory.getOne(Cart);
exports.createCart = catchAsync(async (req, res, next) => {
  let item = await Cart.findOne({ product: req.body.product });
  if (item) {
    item.quantity += req.body.quantity;
    item = await item.save();
    console.log(item);
  } else {
    const { _id } = await Cart.create(req.body);
    item = await Cart.findById(_id);
  }
  console.log(item);

  res.status(201).json({
    status: "success",

    data: item,
  });
});
exports.updateCart = factory.updateOne(Cart);
exports.deleteCart = factory.deleteOne(Cart);
