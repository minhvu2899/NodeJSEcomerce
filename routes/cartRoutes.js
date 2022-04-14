const express = require("express");
const cartController = require("./../controllers/cartController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route("/")
  .get(cartController.getAllCartsByUser)
  .post(
    // authController.restrictTo("user"),
    // cartController.setProductUserIds,
    cartController.createCart
  )
  .delete(cartController.removeAllCartsByUser);

router
  .route("/:id")
  .get(cartController.getCart)
  .patch(authController.restrictTo("user", "admin"), cartController.updateCart)
  .delete(
    authController.restrictTo("user", "admin"),
    cartController.deleteCart
  );

module.exports = router;
