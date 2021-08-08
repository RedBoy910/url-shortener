const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema id-urilor pregenerate
const idSchema = new Schema({
  id: String,
  used: Boolean,
});

module.exports = mongoose.model("short-id", idSchema);
