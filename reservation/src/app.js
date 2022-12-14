const express = require('express');
const router = require('./routes/route');

const app = express();
app.use(express.json());

app.use('/reservations', router);

module.exports = app;