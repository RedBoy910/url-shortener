const idModel = require('../models/id_model.js');
const debug = require('debug')('app:short_router:id_generator');
const chalk = require('chalk');

require('dotenv').config('.env');

//Functie care genereaza un id pentru link-ul scurtat.
//Lungimea id-ului este de 4 caractere, iar functia returneaza un id aleator din lista de id-uri nefolosite
exports.generate_id = async function () {
    let id = idModel.aggregate([
        { $match: { used: false } },
        { $sample: { size: 1 } }
    ]).then(async function (res) {
        let doc = idModel.hydrate(res[0]);
        doc.used = true;
        await doc.save();

        /*
        const filter = { id: doc.id };
        const update = { used: false };

        const test = await idModel.findOneAndUpdate(filter, update);
        console.log(test);
        */

        return doc.id;
    });

    return id;
};