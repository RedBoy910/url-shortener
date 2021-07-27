const urlModel = require('../models/url_model.js');
const debug = require('debug')('app:short_router:id_generator');
const chalk = require('chalk');
const { customAlphabet } = require('nanoid');
const { nolookalikesSafe } = require('nanoid-dictionary'); 

require('dotenv').config('.env');

//Functie care genereaza un id pentru link-ul scurtat.
//Lungimea id-ului este de 6 caractere, iar functia genereaza id-uri pana gaseste un link ce nu mai apare in baza de date
exports.generate_id = async function (len) {
    const nanoid = customAlphabet(nolookalikesSafe, len);
    let duplicate, id;

    do{
        id = nanoid();

        debug(chalk.green(id));

        try{
            duplicate = await urlModel.findOne({ shortUrl: `${process.env.BASE}/${id}` });
        } catch(error) {
            debug(chalk.red(error));
            res.status(500).json('Server error');
        }

    }while(duplicate);

    return id;
};