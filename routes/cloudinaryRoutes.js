const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// middlewares
const multer = require("multer");
// controllers
const {
  upload,
  remove,
  uploadImages,
  resizeUploadImage,
  uploadImage,
} = require("../controllers/cloudinary");
router.post(
  "/uploadImage",
  authController.protect,
  uploadImages,
  resizeUploadImage,
  uploadImage
);
router.post("/removeImage", authController.protect, remove);

module.exports = router;
