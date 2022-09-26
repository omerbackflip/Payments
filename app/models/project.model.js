module.exports = mongoose => {

  var schema = mongoose.Schema(
    {
      project: String,
      suppliers: [{
        name : String,
        budget: Number,
        payments : [{
          date : Date,
          invoice : Number,
          amount : Number,
        }]
      }],
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