class AggregateFeatures {
  constructor(pipeline = [], queryString = {}) {
    this.pipeline = pipeline;
    this.queryString = queryString;
  }

  filter(fields = {}) {
    const match = {};

    Object.entries(fields).forEach(([queryField, dbField]) => {
      const value = this.queryString[queryField];

      if (value !== undefined) {
        match[dbField] = value;
      }
    });

    if (Object.keys(match).length > 0) {
      this.pipeline.push({
        $match: match,
      });
    }

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").reduce((acc, field) => {
        const key = field.startsWith("-") ? field.slice(1) : field;

        acc[key] = field.startsWith("-") ? -1 : 1;

        return acc;
      }, {});

      this.pipeline.push({
        $sort: sortBy,
      });
    } else {
      this.pipeline.push({
        $sort: {
          createdAt: -1,
        },
      });
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").reduce((acc, field) => {
        acc[field] = 1;
        return acc;
      }, {});

      this.pipeline.push({
        $project: fields,
      });
    }

    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 10;

    const skip = (page - 1) * limit;

    this.pipeline.push(
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    );

    return this;
  }
}

export default AggregateFeatures;
