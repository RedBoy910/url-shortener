const mongoose = require('mongoose');
const { exit } = require('process');
const debug = require('debug')('app:db');

require('dotenv').config('../.env');

//Functie care conecteaza aplicatia la baza de date
exports.connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        debug('Connected to MongoDB');
    } catch (error) {
        debug(error);
        exit(1);
    }
}
