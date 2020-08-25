const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const saltRound = 10;
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 8,
    },
    lastname: {
        type: String,
        maxlength: 50,
    },
    role: {
        type: Number,
        default: 0
    },
    token: {
        type:String,
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function (next) {
    let user = this;
    
    if(user.isModified('password')) {
        bcrypt.genSalt(saltRound, (err, salt) => {
            if(err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) {
                    return next(err);
                }
                user.password = hash;
                next()
            });
        })  
    }
    else {
        next()
    }
})

userSchema.methods.comparePassword = function (pw, cb) {
    bcrypt.compare(pw,this.password, function (err, isMatch) {
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function (cb){
    let user = this;
    let token = jwt.sign(user._id.toHexString(), 'sceret');
    user.token = token;

    user.save((err, user) => {
        if(err) {
            return cb(err)
        }
        cb(null, user)
    })
}

userSchema.statics.findByToken = function (token, cb) {
    let user = this;

    jwt.verify(token, 'sceret', (err, decode) => {
        user.findOne({_id: decode, token: token}, (err, user) => {
            if(err) return cb(err)
            cb(null, user)
        })
    })
}

const User = mongoose.model('User', userSchema);

module.exports = {User}