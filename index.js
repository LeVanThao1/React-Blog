const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(
        'mongodb+srv://thaolv210402:ta210402@cluster0.6z86x.mongodb.net/<dbname>?retryWrites=true&w=majority', 
        {useNewUrlParser: true}
    ).then(() => console.log('connect db'))
    .catch((err) => console.log(err))


app.listen(5000)