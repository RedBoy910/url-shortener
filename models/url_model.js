const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema pentru incarcarea link-urilor in baza de data
//Mai multe la https://mongoosejs.com/docs/guide.html
const urlSchema = new Schema({
    _id: {type: String, required: true},
    longUrl: {type: String, required: true},
    shortUrl: {type: String, required: true},
    date: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('urlModel', urlSchema);