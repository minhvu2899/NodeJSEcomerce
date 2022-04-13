class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    console.log("query", queryObj);
    if (queryObj.price) {
      queryObj.priceSale = {
        gte: +queryObj.price.split(",")[0],
        lte: +queryObj.price.split(",")[1],
      };
      delete queryObj["price"];
    }
    console.log("query", queryObj);
    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sort = this.queryString.sort;
      const sortBy = this.queryString.sort.split(",").join(" ");
      console.log(sort, sortBy);
      if (sort === "newest") {
        this.query = this.query.sort("-createdAt");
      }
      if (sort.startsWith("price")) {
        const s = sort.split(":");
        console.log(s);
        if (s[1] === "ASC") {
          this.query = this.query.sort("priceSale");
        } else {
          this.query = this.query.sort("-priceSale");
        }
      }

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;
