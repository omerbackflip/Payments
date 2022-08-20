const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.payments = require("./payment.model.js")(mongoose);
db.tables = require("./table.model.js")(mongoose);
db.projects = require("./project.model.js")(mongoose);

module.exports = db; 