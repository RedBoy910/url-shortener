const express = require('express');
const app = express()
const debug = require('debug')('app:short_router');
const router = express.Router();
const util = require('../utils/url_validator.js');
const { nanoid } = require('nanoid')
const urlModel = require('../models/url_model.js');

require('dotenv').config('.env');

//Routing pentru generarea unui link scurtat. 
//Functia verifica daca link-ul din request este unul valid folosind un regexp
//Functia returneaza link-ul scurtat din baza de date daca exista deja, daca nu genereaza un link scurtat nou
router.post('/', async (req, res) => {
    const { url } = req.body;

    if(util.valid_url(url))
    {
        try{
            const duplicate = await urlModel.findOne({ longUrl: url });

            if(duplicate)
                res.status(201).json({ short: duplicate.shortUrl });
            else{
                const id = nanoid(12);
                const shortUrl = `${process.env.BASE}/${id}`;

                const shortPackage = new urlModel({
                    longUrl: url,
                    shortUrl: shortUrl,
                    date: Date.now()
                });

                await shortPackage.save();
                res.status(201).json({ short: shortUrl });
            }
        } catch(error) {
            debug(error);
            res.status(500).json('Server error');
        }
    }
    else
        res.status(400).json('Invalid URL');
});

module.exports = router;