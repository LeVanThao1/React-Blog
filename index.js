const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {User} = require('./models/user')
const config = require('./config/key')
const {auth} = require('./middlewares/auth')
const cors = require('cors')

// const headers = {
//     'allowedHeaders': ['Content-Type', 'Authorization'],
//     'origin': '*',
//     'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     'preflightContinue': true
// };

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
mongoose.connect(
        config.mongoURI, 
        {useNewUrlParser: true}
    ).then(() => console.log('connect db'))
    .catch((err) => console.log(err))

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())
// app.use(cors(headers))

app.get('/', (req, res, next) => {
    res.json('hello')
})

app.get('/api/users/auth', auth, (req, res, next) => {
    res.status(200).json({
        _id: req._id,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role
    })
})


app.post('/api/users/register', (req, res, next) => {
    const user = new User(req.body);

    user.save((err, doc) => {
        if(err) {
            return res.json({success: false, err})
        }
        res.status(201).json({
            success: true,
            data: doc
        })
    })
})

app.post('/api/users/login', (req, res, next) => {
    // find email
    User.findOne({email: req.body.email}, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found" 
            })
        }
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) {
                return res.json({
                    loginSuccess: false,
                    message: "wrong pasword" 
                })
            }
        })

        user.generateToken((err, user) => {
            if(err) {
                return res.status(400).send(err)
            }
            res.cookie("x_auth", user.token)
                .status(200).json({
                    loginSuccess: true
                })
        })
    })
})

app.get('/api/users/logout', auth,(req, res, next) => {
    User.findOneAndUpdate({_id: req.user._id}, {token : ""}, (err,doc) => {
        if(err) return res.json({success: false, err})
        return res.status(200).send({
            success: true
        })
    })
})

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log("server is running port ",port)
})