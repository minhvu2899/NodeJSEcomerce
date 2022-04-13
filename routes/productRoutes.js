const express = require("express");
const productController = require("./../controllers/productController");
const authController = require("./../controllers/authController");
const reviewRouter = require("./../routes/reviewRoutes");
const cloudinary = require("./../controllers/cloudinary");
const router = express.Router();

router.use("/:productId/reviews", reviewRouter);

router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    productController.createProduct
  );
router
  .route("/remove/image/:folder/:id")
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
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
    authController.restrictTo("admin"),
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
