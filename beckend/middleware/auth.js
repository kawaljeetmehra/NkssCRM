const passport = require('passport');

module.exports = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || !user) {
            if (info && info.name === 'JsonWebTokenError') {
                return res.status(401).json({ status: 401, message: "Invalid token" });
            }
            return res.status(401).json({ status: 401, message: "Unauthorized" });
        }
        req.user = user; 
        next(); 
    })(req, res, next);
}