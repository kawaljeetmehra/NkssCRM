const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const upload = require('../config/multer');
const AuthController = require("../controller/AuthController");
const passportAuth = require('../config/passport');
const session = require('express-session');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-session-secret', 
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

const jwtOptions = {
    secretOrKey: 'your-secret-key',
};

app.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(401).json({ status:"401", message: 'Unauthorized' });
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }
            const token = jwt.sign({ sub: user.RecordID }, jwtOptions.secretOrKey);
            return res.json({ token, user });
        });
    })(req, res, next);
}); 


app.post('/register', upload.single('file'), (req, res) => {
    const imagePath = req.protocol + '://' + req.get('host') + '/' + req.file.path;
    AuthController.register(req, imagePath, (err, data) => {
        if(err){
            res.json({status:500, message: "Internal Server Error : "+err.message})
        }
        res.json({status:200, message:"success"})
    })
});

module.exports = app;
