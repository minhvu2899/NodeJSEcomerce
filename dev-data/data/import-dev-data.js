const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./../../models/productModel");
const Review = require("./../../models/reviewModel");
const User = require("./../../models/userModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then(() => console.log("DB connection successful!"));

// READ JSON FILE
// const products = JSON.parse(fs.readFileSync(`${__dirname}/tivi.json`, "utf-8"));
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/tulanh.json`, "utf-8")
);
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
// const reviews = JSON.parse(
//   fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
// );

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Product.create(products);
    // await User.create(users, { validateBeforeSave: false });
    // await Review.create(reviews);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
const updateData = async () => {
  try {
    // const data = {
    //   public_id: "products/product-1649665927144-cover",
    //   url: "https://res.cloudinary.com/vhm/image/upload/v1649665929/products/product-1649665927144-cover.jpg",
    // };
    // const dataTivi = {
    //   public_id: "products/product-1649667892921-cover",
    //   url: "https://res.cloudinary.com/vhm/image/upload/v1649667895/products/product-1649667892921-cover.jpg",
    // };
    // [
    //   {
    //     public_id: "products/product-1649667892921-cover",
    //     url: "https://res.cloudinary.com/vhm/image/upload/v1649667895/products/product-1649667892921-cover.jpg",
    //   },
    //   {
    //     public_id: "products/product-1649667892921-cover",
    //     url: "https://res.cloudinary.com/vhm/image/upload/v1649667895/products/product-1649667892921-cover.jpg",
    //   },
    //   {
    //     public_id: "products/product-1649667892921-cover",
    //     url: "https://res.cloudinary.com/vhm/image/upload/v1649667895/products/product-1649667892921-cover.jpg",
    //   },
    //   {
    //     public_id: "products/product-1649667892921-cover",
    //     url: "https://res.cloudinary.com/vhm/image/upload/v1649667895/products/product-1649667892921-cover.jpg",
    //   },
    // ];
    // const p = await Product.find({}).select("ratingsAverage");
    const products = await Product.updateMany({
      isActive: true,
    });
    console.log(p);
    // const updateProduct = products.map(async (pro) => {
    //   pro.images = [];
    //   return await pro.save();
    // });
    // await Promise.all(updateProduct);
    // await User.create(users, { validateBeforeSave: false });
    // await Review.create(reviews);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Product.deleteMany({ category: "62175b679d15662eea0b21f7" });
    // await User.deleteMany();
    // await Review.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
} else if (process.argv[2] === "--update") {
  updateData();
}
