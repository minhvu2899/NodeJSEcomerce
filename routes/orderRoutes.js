const express = require("express");
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");

const router = express.Router();
router.route("/stats").get(orderController.getOrderStats);
router.route("/stats/product").get(orderController.getProductStats);
router.route("/stats/customer").get(orderController.getCustomerStats);
router
  .route("/")
  .get(
    // authController.protect,
    // authController.restrictTo("user"),
    orderController.getAllOrders
  )
  .post(
    authController.protect,
    authController.restrictTo("user"),
    orderController.createOrder
  );

router
  .route("/myOrders")
  .get(authController.protect, orderController.getMyOrders);
//   .patch(
//     authController.protect,
//     authController.restrictTo("admin", "lead-guide"),
//     orderController.updateOrder
//   )
//   .delete(
//     authController.protect,
//     authController.restrictTo("admin", "lead-guide"),
//     orderController.deleteOrder
//   );

router.route("/:id").get(orderController.getOrder);
router.route("/:id/status").patch(orderController.updateOrderStatus);
router.route("/:id/payment").patch(orderController.updateOrderToPaid);
module.exports = router;
