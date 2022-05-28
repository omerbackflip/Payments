module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      project: String,
      clear: Number,
      amount: Number,
      vat: Number,
      total: Number,
      payMethod: String,
      date: Date,
      supplier: String,
      invoiceId: String,
      remark: String,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Payment = mongoose.model("payment", schema);
  return Payment;
};