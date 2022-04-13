const multer = require("multer");
const sharp = require("sharp");
const Product = require("./../models/productModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProductImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

exports.resizeProductImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover && !req.files.image) return next();
  // 1) Cover image
  req.folder = "products";
  req.public_id = `product-${Date.now()}-cover`;
  req.data = req.files.imageCover
    ? await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toBuffer()
    : await sharp(req.files.image[0].buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toBuffer();
  console.log(req.data);
  next();
});

exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOneBySlug(Product, { path: "reviews" });
exports.getProductBySlug = factory.getOneBySlug(Product, { path: "reviews" });
exports.createProduct = factory.createOne(Product);
exports.updateProduct = factory.updateOneBySlug(Product);
exports.deleteProduct = factory.deleteOne(Product);
exports.getProductRelated = catchAsync(async (req, res, next) => {
  const slug = req.params.slug;
  const product = await Product.findOne({ slug });
  if (!product) {
    next(new AppError("Product not found", 400));
  }
  let filter = { slug: { $ne: product.slug }, category: product.category._id };

  const features = new APIFeatures(Product.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const featuresTemp = new APIFeatures(
    Product.find(filter),
    req.query
  ).filter();
  // const doc = await features.query.explain();
  let limit = req.query.limit * 1 || 10;
  const doc = await features.query;
  const doc1 = await featuresTemp.query;
  console.log(doc1.length, this.queryString);
  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: doc.length,
    data: {
      data: doc,
      pagination: {
        total_page: Math.ceil(doc1.length / limit),
      },
    },
  });
});
exports.getProductStats = catchAsync(async (req, res, next) => {
  const stats = await Product.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});
