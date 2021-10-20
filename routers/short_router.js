const express = require('express');
const mongoose = require('mongoose');
const debug = require('debug')('app:short_router');
const router = express.Router();
const utilId = require('../utils/id_generator.js');
const urlModel = require('../models/url_model.js');
const chalk = require('chalk');
const urlExists = require('url-exists-deep');

require('dotenv').config('.env');

//Routing pentru generarea unui link scurtat. 
//Functia verifica daca link-ul din request este unul valid folosind un regexp
//Functia returneaza link-ul scurtat din baza de date daca exista deja, daca nu genereaza un link scurtat nou
router.post('/', async (req, res) => {
    let { url } = req.body;

    if(!url.startsWith("http://") && !url.startsWith("https://"))
       url = "http://" + url;

    const valid = await urlExists(url);

    if(valid != false)
    {
        let finished = false;
        let retry = 0;

        while (!finished && retry < 20) {
            try{
                const duplicate = await urlModel.findOne({ longUrl: url });
    
                if(duplicate){
                    res.status(201).json({ short: duplicate.shortUrl });
                    finished = true;
                }
                else{
                    const id = await utilId.generate_id(parseInt(process.env.ID_LENGTH));
                    const shortUrl = `${process.env.SHORT_BASE}/r/${id}`;
    
                    const shortPackage = new urlModel({
                        _id: id,
                        longUrl: url,
                        shortUrl: shortUrl,
                        date: Date.now()
                    });
    
                    await shortPackage.save();
    
                    debug(chalk.green('Shortening succesful'));
                    res.status(201).json({ short: shortUrl });
                    finished = true;
                }
            } catch(error){
                if(error.toString().includes('E11000'))
                    retry++;
                else
                {
                    debug(chalk.red(error));
                    res.status(500).json('Server error');
                    finished = true;
                }
            }
        }

        if(retry == 20)
            res.status(500).json("Fatal Error: out of ID's");
    }
    else
    {
        debug(chalk.red('Invalid URL syntax'));
        res.status(400).json('Invalid URL');
    }
});

module.exports = router;