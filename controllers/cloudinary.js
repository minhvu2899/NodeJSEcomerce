const { v2: cloudinary } = require("cloudinary");
const multer = require("multer");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const sharp = require("sharp");
const { Readable } = require("stream");
const fs = require("fs");
// config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
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
exports.resizeUploadImage = catchAsync(async (req, res, next) => {
  console.log("file", req.file);
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  next();
});

exports.uploadImages = upload.single("image");

// req.files.file.path
const bufferToStream = (buffer) => {
  const readable = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });
  return readable;
};

exports.remove = (req, res) => {
  let folder = req.params.folder;
  let image_id = req.params.id;

  cloudinary.uploader.destroy(`${folder}/${image_id}`, (err, result) => {
    if (err) return res.json({ success: false, err });
    res.status(204).json({ message: "success" });
  });
};
exports.uploads = (public_id, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id },
      (error, result) => {
        if (error)
          reject(
            new AppError("Something went wrong please try again later..", 404)
          );
        resolve({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    );
  });
};
exports.uploadImage = async (req, res, next) => {
  //   try {
  //     console.log("files", req.files);
  //     let result = await cloudinary.uploader.upload(
  //       req.file.path,
  //       {
  //   public_id: `${Date.now()}`,
  //         resource_type: "auto", // jpeg, png
  //       },
  //       function (error, result) {
  //         console.log(error);
  //       }
  //     );
  //     // const { secure_url } = await bufferUpload(buffer);
  //     //   res.
  //     res.status(200).json({
  //       public_id: result.public_id,
  //       url: result.secure_url,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     res.send("Something went wrong please try again later..");
  //   }
  const data = req.data;
  console.log(data);
  const stream = cloudinary.uploader.upload_stream(
    { folder: req.folder, public_id: req.public_id },
    (error, result) => {
      if (error)
        return next(
          new AppError("Something went wrong please try again later..", 404)
        );
      res.status(200).json({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  );
  bufferToStream(data).pipe(stream);
};
