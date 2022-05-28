//    When a client sends request for an endpoint using HTTP request (GET, POST, PUT, DELETE), we need to determine how the server will reponse by setting up the routes.

//    These are our routes:

//    /api/payments: GET, POST, DELETE
//    /api/payments/:id: GET, PUT, DELETE
//    /api/payments/published: GET
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

module.exports = app => {
  const payments = require("../controllers/payment.controller.js");

  var router = require("express").Router();

  // Update an invoice with Excel_Rec_ID
  router.put("/update-records", payments.updateExcelRecID);
  
  // Save Bulk of invoices
  router.post("/save-bulk",upload.single('file'), payments.saveBulk);
  
  // Create a new Payment
  router.post("/", payments.create);

  // Retrieve all Payments
  router.get("/", payments.findAll);

  // Retrieve all published Payments
  router.get("/published", payments.findAllPublished);

  // Retrieve a single Payment with id
  router.get("/:id", payments.findOne);

  // Update a Payment with id
  router.put("/:id", payments.update);

  // Delete a Payment with id
  router.delete("/:id", payments.delete);

  // Delete all Payments
  router.delete("/", payments.deleteAll);


  app.use('/api/payments', router);
};