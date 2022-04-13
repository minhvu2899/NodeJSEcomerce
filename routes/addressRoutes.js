const express = require("express");
const addressController = require("./../controllers/addressController");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");
const router = express.Router();

// router.use("/:productId/category", reviewRouter);
router.use(authController.protect);
router
  .route("/")
  .get(userController.getMe, addressController.getAllAddresses)
  .post(
    authController.protect,
    authController.restrictTo("user", "admin"),
    addressController.updateDefaultAddress,
    addressController.createAddress
  );

router
  .route("/:id")
  .get(addressController.getAddress)
  .patch(
    authController.protect,
    authController.restrictTo("user"),
    // AddressController.uploadAddressImages,
    // AddressController.resizeAddressImages,
    addressController.updateDefaultAddress,
    addressController.updateAddress
  )
  .delete(
    authController.protect,
    authController.restrictTo("user"),
    addressController.deleteAddress
  );

module.exports = router;
