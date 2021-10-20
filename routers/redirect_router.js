const express = require('express');
const debug = require('debug')('app:redirect_router');
const router = express.Router();
const urlModel = require('../models/url_model.js');
const chalk = require('chalk');

require('dotenv').config('.env');

//Functie care redirectioneaza request-ul catre link-ul scurtat catre link-ul original
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    //debug(chalk.green(`${process.env.BASE}/r/${id}`));

    try{
        const redirectUrl = await urlModel.findOne({ shortUrl: `${process.env.SHORT_BASE}/r/${id}` });

        if(redirectUrl){
            debug(chalk.green('Redirect succesful'));
            res.redirect(redirectUrl.longUrl);
        }
        else{
            debug(chalk.red('Invalid short URL'));
            res.status(404).json('Invalid URL');
        }

    } catch(error){
        debug(chalk.red(error));
        res.status(500).json('Server error');
    }
});

module.exports = router;