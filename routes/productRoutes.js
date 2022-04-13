const express = require("express");
const productController = require("./../controllers/productController");
const authController = require("./../controllers/authController");
const reviewRouter = require("./../routes/reviewRoutes");
const cloudinary = require("./../controllers/cloudinary");
const router = express.Router();

// router.param('id', productController.checkID);

// POST /Product/234fad4/reviews
// GET /Product/234fad4/reviews

router.use("/:productId/reviews", reviewRouter);

// router
//   .route("/top-5-cheap")
//   .get(productController.aliasTopProducts, productController.getAllProducts);

// router.route("/product-stats").get(productController.getProductStats);
// router
//   .route("/monthly-plan/:year")
//   .get(
//     authController.protect,
//     authController.restrictTo("admin", "lead-guide", "guide"),
//     productController.getMonthlyPlan
//   );
router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    productController.createProduct
  );
router.route("/remove/image/:folder/:id").delete(
  authController.protect,
  // authController.restrictTo("admin"),
  cloudinary.remove
);
router
  .route("/upload/image")
  .post(
    authController.protect,
    productController.uploadProductImages,
    productController.resizeProductImages,
    cloudinary.uploadImage
  );

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(
    authController.protect,
    // authController.restrictTo("admin", "lead-guide"),
    // productController.uploadProductImages,
    // productController.resizeProductImages,
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    productController.deleteProduct
  );
router.route("/:slug").get(productController.getProductBySlug);
router.route("/:slug/related").get(productController.getProductRelated);
module.exports = router;
