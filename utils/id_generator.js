const idModel = require("../models/id_model.js");
const debug = require("debug")("app:short_router:id_generator");
const chalk = require("chalk");

require("dotenv").config(".env");

//Functie care genereaza un id pentru link-ul scurtat.
//Lungimea id-ului este de 4 caractere, iar functia returneaza un id aleator din lista de id-uri nefolosite
exports.generate_id = async function () {
  const filter = { used: false };
  const update = { used: true };

  let res = await idModel.findOneAndUpdate(filter, update);

  return res.id;
};
