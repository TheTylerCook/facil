require('dotenv').config();
const bodyParser = require('body-parser')
    , express = require('express')
    , cors = require('cors')
    , session = require('express-session')
    , passport = require('passport')
    ,Auth0Strategy = require('passport-auth0')


const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new Auth0Strategy({
    domain: process.env.AUTH_DOMAIN,
    clientID: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    callbackURL: process.env.AUTH_CALLBACK
}, function(accessToken, refreshToken, extraParams, profile, done) {



    done(null, profile)
}))

passport.serializeUser(function(profile, done) {
    done(null, profile);
})
passport.deserializeUser(function(profile, done) {
    done(null, profile);
})

app.get('/auth', passport.authenticate('auth0'));
app.get('/auth/callback', passport.authenticate('auth0', {
    successRedirect: 'http://localhost:3000/',
    failureRedirect: '/auth'
}))
app.get('/auth/me', function(req, res) {
    if(!req.user) {
        return res.status(401).send('No user logged in.')
    }
    return res.status(200).send(req.user);
})
const PORT = 4444;

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));


//install express body-parser cors dotenv express-session
// install passport passport-auth0
//turn off OICD in auth0, add callback URL