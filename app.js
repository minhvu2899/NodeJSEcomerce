const express = require("express");
const app = express();
const compression = require("compression");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const subcategoryRouter = require("./routes/subcategoryRoutes");
const orderRouter = require("./routes/orderRoutes");
const addressRouter = require("./routes/addressRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const cloudinaryRouter = require("./routes/cloudinaryRoutes");
const cartRouter = require("./routes/cartRoutes");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const path = require("path");
const cors = require("cors");
app.use(morgan("dev"));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(cors());
app.options("*", cors());
// Serving static files
app.use(express.static(path.join(__dirname, "public")));
console.log(path.join(__dirname, "public"));
// Set security HTTP headers
app.use(helmet());
app.use(compression());
// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());
// app.use("/api", limiter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subcategories", subcategoryRouter);
app.use("/api/v1/carts", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/addresses", addressRouter);
app.use("/api/v1/comments", reviewRouter);
app.use("/api/v1/uploads", cloudinaryRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
