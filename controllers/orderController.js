const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Order = require("./../models/orderModel");
const Product = require("./../models/productModel");
const factory = require("./handlerFactory");
const APIFeatures = require("./../utils/apiFeatures");
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const description = (status) => {
  switch (status) {
    case "NEW":
      return "Khách hàng đã tạo một đơn hàng mới";
    case "CONFIRM":
      return "Đơn hàng đã được xác nhận";
    case "IN_PROGRESS":
      return "Đơn hàng đang được xử lí";
    case "PACKAGED":
      return "Đơn hàng đã được đóng gói và sẵn sàng giao cho đơn vị vận chuyển";
    case "PICKED":
      return "Shipper đã lấy hàng";
    case "DELIVERED":
      return "Đơn hàng đã được giao thành công";
    case "DONE":
      return "Đơn hàng đã được hoàn thành";
    case "PAID":
      return "Đơn hàng đã thanh toán thành công";
    case "CANCEL":
      return "Đơn hàng đã hủy thành công";
  }
};

exports.createOrder = catchAsync(async (req, res, next) => {
  const ordertrack = { status: "NEW", description: description("NEW") };
  req.body.orderTracks = [ordertrack];
  const doc = await Order.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});
exports.getOrder = factory.getOne(Order);

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  console.log(order);
  if (!order) {
    return next(new AppError("No document found with that ID", 404));
  }
  order.orderStatus = req.body.status;
  const qtys = [];
  let checkQty = false;
  if (req.body.status === "PACKAGED") {
    const ids = order.orderItems.map((item) => {
      qtys.push(item.quantity);
      return item.product;
    });
    console.log(ids, qtys);
    const product = await Product.find({ _id: ids });
    console.log(product);

    product.map((p, idx) => {
      checkQty = p.countInStock < qtys[idx] ? true : false;
    });
  }
  if (req.body.status === "DELIVERED") {
    order.isPaid = true;
    order.paidAt = Date.now();
    const ids = order.orderItems.map((item) => {
      qtys.push(item.quantity);
      return item.product;
    });
    console.log(ids, qtys);
    const product = await Product.find({ _id: ids });
    console.log(product);

    const updateSold = product.map(async (p, idx) => {
      p.sold += qtys[idx];
      q.countInStock -= qtys[idx];
      return await p.save();
    });
    await Promise.all(updateSold);
  }
  if (checkQty)
    return next(new AppError("Có sản phẩm không đủ số lượng trong kho", 400));
  const ordertrack = {
    status: req.body.status,
    description: description(req.body.status),
  };
  order.orderTracks.unshift(ordertrack);
  const updatedOrder = await order.save();
  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});

exports.updateOrderToPaid = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.paymentResult.id,
      status: req.body.paymentResult.status,
      update_time: req.body.paymentResult.update_time,
      email_address: req.body.paymentResult.payer.email_address,
    };
    order.orderStatus = req.body.status;
    const updatedOrder = await order.save();

    res.status(200).json({
      status: "success",
      data: updatedOrder,
    });
  } else {
    return next(new AppError("Order not found", 404));
  }
});

exports.getMyOrders = catchAsync(async (req, res) => {
  const features = new APIFeatures(
    Order.find({ user: req.user._id }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const featuresTemp = new APIFeatures(
    Order.find({ user: req.user._id }),
    req.query
  )
    .filter()
    .sort()
    .limitFields();
  const doc = await features.query;
  const doc1 = await featuresTemp.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: doc.length,
    data: {
      data: doc,
      pagination: {
        total_page: Math.ceil((doc1.length / features.queryString.limit) * 1),
      },
    },
  });
});

exports.getAllOrders = catchAsync(async (req, res) => {
  const features = new APIFeatures(Order.find({}), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const featuresTemp = new APIFeatures(Order.find({}), req.query).filter();
  const doc = await features.query;
  const doc1 = await featuresTemp.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: doc.length,
    data: {
      data: doc,
      pagination: {
        total_page: Math.ceil((doc1.length / features.queryString.limit) * 1),
      },
    },
  });
});
exports.getOrderStats = catchAsync(async (req, res, next) => {
  console.log(req.query);
  const date_start = new Date(req.query.date_start);
  const date_end = new Date(req.query.date_end);
  const year = 2022;
  const stats = await Order.aggregate([
    {
      $unwind: "$orderItems",
    },
    {
      $match: {
        createdAt: {
          $gte: date_start,
          $lte: date_end,
        },
        orderStatus: "DELIVERED",
      },
    },
    {
      $group: {
        _id: "$user",
        numOrders: { $sum: 1 },
        numQuantity: { $sum: "$orderItems.quantity" },
        sumIncome: { $sum: "$total" },
        sumCost: { $sum: "$shippingPrice" },
      },
    },
  ]);

  res.status(200).json({
    status: "success",

    stats,
  });
});
exports.getProductStats = catchAsync(async (req, res, next) => {
  const date_start = new Date(req.query.date_start);
  const date_end = new Date(req.query.date_end);

  const stats = await Order.aggregate([
    {
      $unwind: "$orderItems",
    },
    {
      $match: {
        createdAt: {
          $gte: date_start,
          $lte: date_end,
        },
        orderStatus: "DELIVERED",
      },
    },
    {
      $group: {
        _id: "$orderItems.product",
        numQuantity: { $sum: 1 },
        products: { $push: "$orderItems.product_name" },
      },
    },

    // {
    //   $addFields: { month: "$_id" },
    // },
    // {
    //   $project: {
    //     _id: 0,
    //   },
    // },
    // {
    //   $sort: { numTourStarts: -1 },
    // },
    // {
    //   $limit: 12,
    // },
  ]);

  res.status(200).json({
    status: "success",
    stats,
  });
});
exports.getCustomerStats = catchAsync(async (req, res, next) => {
  const date_start = new Date(req.query.date_start);
  const date_end = new Date(req.query.date_end);

  const stats = await Order.aggregate([
    {
      $unwind: "$orderItems",
    },
    {
      $match: {
        createdAt: {
          $gte: date_start,
          $lte: date_end,
        },
        orderStatus: "DELIVERED",
      },
    },
    {
      $group: {
        _id: "$user",
        numQuantity: { $sum: 1 },
        products: { $push: "$orderItems.product_name" },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    stats,
  });
});
