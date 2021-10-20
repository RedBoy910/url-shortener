const express = require('express');
const debug = require('debug')('app');
const chalk = require('chalk');
const morgan = require('morgan');
const shortRouter = require('./routers/short_router.js');
const redirectRouter = require('./routers/redirect_router.js');
const db = require('./config/db.js');
const path = require('path');
require('dotenv').config('.env');
const app = express();

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

//Conectarea la baza de date
db.connectDB();

//Routing pentru request-ul de scurtare a unui link
app.use('/api/urls', shortRouter);

//Routing pentur redirectionarea request-urilor cu link-uri scurtate
app.use('/r/', redirectRouter);

app.listen(process.env.PORT, () => {
    debug(`Listening on PORT ${chalk.green(process.env.PORT)}`);
});