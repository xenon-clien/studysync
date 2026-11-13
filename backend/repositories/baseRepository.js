class BaseRepository {
  constructor(Model) {
    this.Model = Model;
  }

  async findAll(filter = {}, options = {}) {
    let query = this.Model.find(filter);
    if (options.sort) query = query.sort(options.sort);
    if (options.select) query = query.select(options.select);
    if (options.skip) query = query.skip(options.skip);
    if (options.limit) query = query.limit(options.limit);
    return query;
  }

  async count(filter = {}) {
    return this.Model.countDocuments(filter);
  }

  async findOne(filter) {
    return this.Model.findOne(filter);
  }

  async create(data) {
    return this.Model.create(data);
  }

  async updateOne(filter, data) {
    return this.Model.findOneAndUpdate(filter, data, {
      returnDocument: 'after',
      runValidators: true,
    });
  }

  async deleteOne(filter) {
    return this.Model.findOneAndDelete(filter);
  }
}

module.exports = BaseRepository;
