const express = require("express");
const debug = require("debug")("app:short_router");
const router = express.Router();
const utilValidator = require("../utils/url_validator.js");
const utilId = require("../utils/id_generator.js");
const urlModel = require("../models/url_model.js");
const chalk = require("chalk");

require("dotenv").config(".env");

//Routing pentru generarea unui link scurtat.
//Functia verifica daca link-ul din request este unul valid folosind un regexp
//Functia returneaza link-ul scurtat din baza de date daca exista deja, daca nu genereaza un link scurtat nou
router.post("/", async (req, res) => {
  const { url } = req.body;

  if (utilValidator.valid_url(url)) {
    try {
      const duplicate = await urlModel.findOne({ longUrl: url });
      if (duplicate) res.status(201).json({ short: duplicate.shortUrl });
      else {
        const id = await utilId.generate_id();

        const shortUrl = `${process.env.BASE}/${id}`;

        const shortPackage = new urlModel({
          longUrl: url,
          shortUrl: shortUrl,
          date: Date.now(),
        });

        await shortPackage.save();

        debug(chalk.green("Shortening succesful"));
        res.status(201).json({ short: shortUrl });
      }
    } catch (error) {
      debug(chalk.red(error));
      res.status(500).json("Server error");
    }
  } else {
    debug(chalk.red("Invalid URL syntax"));
    res.status(400).json("Invalid URL");
  }
});

module.exports = router;
