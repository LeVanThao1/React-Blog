const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key')

mongoose.connect(
        config.mongoURI, 
        {useNewUrlParser: true}
    ).then(() => console.log('connect db'))
    .catch((err) => console.log(err))

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())

app.listen(5000)