class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter(allowedFields = []) {
    const queryObj = { ...this.queryString };

    const excludedFields = ["page", "sort", "limit", "fields"];

    excludedFields.forEach((el) => delete queryObj[el]);

    Object.keys(queryObj).forEach((field) => {
      if (!allowedFields.includes(field)) {
        delete queryObj[field];
      }
    });

    if (queryObj.date) {
      const date = new Date(queryObj.date);

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const startOfNextDay = new Date(date);
      startOfNextDay.setHours(24, 0, 0, 0);

      queryObj.date = {
        $gte: startOfDay,
        $lt: startOfNextDay,
      };
    }

    Object.keys(queryObj).forEach((field) => {
      if (
        queryObj[field] &&
        typeof queryObj[field] === "object" &&
        !Array.isArray(queryObj[field])
      ) {
        Object.keys(queryObj[field]).forEach((operator) => {
          if (["gte", "gt", "lte", "lt"].includes(operator)) {
            queryObj[field][`$${operator}`] = queryObj[field][operator];

            delete queryObj[field][operator];
          }
        });
      }
    });

    this.query = this.query.find(queryObj);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");

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
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
