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
      // description: String,
      budget: Number,
      revenues : Number,
      supplier : String,
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