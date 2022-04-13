const SubCategory = require("../models/subcategoryModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
exports.getAllCategorys = factory.getAll(SubCategory);
exports.getCategory = factory.getOne(SubCategory);
exports.createCategory = factory.createOne(SubCategory);
exports.updateCategory = factory.updateOne(SubCategory);
exports.deleteCategory = factory.deleteOne(SubCategory);
exports.getSubByCategory = catchAsync(async (req, res) => {
  const category = req.params.categoryId;
  const subs = await SubCategory.find({ category });
  res.status(200).json({
    status: "success",
    data: {
      data: subs,
    },
  });
});
