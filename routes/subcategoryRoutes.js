const express = require("express");
const subcategoryController = require("./../controllers/subcategoryController");
const authController = require("./../controllers/authController");

const router = express.Router();

// router.use("/:productId/category", reviewRouter);

router
  .route("/")
  .get(subcategoryController.getAllCategorys)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    subcategoryController.createCategory
  );

router
  .route("/:id")
  .get(subcategoryController.getCategory)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    subcategoryController.updateCategory
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    subcategoryController.deleteCategory
  );
router
  .route("/category/:categoryId")
  .get(subcategoryController.getSubByCategory);
module.exports = router;
