module.exports = mongoose => {

  var supplierSchema = mongoose.Schema(
    {
      name: String,
      budget: Number,
      utilized: Number
    },
  );

  var schema = mongoose.Schema(
    {
      project: String,
      // supplier: [supplierSchema],
      supplier : String,
      // description: String,
      budget: Number,
      payments : Number,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Project = mongoose.model("project", schema);
  return Project;
};