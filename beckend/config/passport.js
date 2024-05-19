const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const AuthController = require("../controller/AuthController");

const localStrategyCallback = (username, password, done) => {
    AuthController.fetch()
        .then(users => {
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                return done(null, user);
            } else {
                console.log('Invalid username or password:', username);
                return done(null, false, { message: 'Invalid username or password' });
            }
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            return done(error);
        });
};

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your-secret-key',
};

const jwtStrategyCallback = (payload, done) => {
    AuthController.fetch()
        .then(users => {
            const user = users.find(u => u.RecordID === payload.sub);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Invalid token' });
            }
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            return done(error);
        });
};

passport.use(new LocalStrategy(localStrategyCallback));
passport.use(new JwtStrategy(jwtOptions, jwtStrategyCallback));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    AuthController.fetch()
        .then(users => {
            const user = users.find(u => u.id === id);
            if (user) {
                done(null, user);
            } else {
                done(new Error('User not found'));
            }
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            done(error);
        });
});

module.exports = passport;
