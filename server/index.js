require('dotenv').config();
const bodyParser = require('body-parser')
    , express = require('express')
    , cors = require('cors')
    , session = require('express-session')
    , passport = require('passport')
    ,Auth0Strategy = require('passport-auth0')
    ,request = require('request')


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

// passport.serializeUser(function(profile, done) {
//     done(null, profile);
// })
// passport.deserializeUser(function(profile, done) {
//     done(null, profile);
// })

passport.serializeUser( (user, done) => {
    const { _json } = user;
    done(null, {clientID: _json.clientID,
                email: _json.email,
                name: _json.name,
                followers: json.followers_url
    
    })
})

passport.deserializeUser(( obj, done) => {
    done(null, obj);
})


// app.get('/auth', passport.authenticate('auth0'));
// app.get('/auth/callback', passport.authenticate('auth0', {
//     successRedirect: 'http://localhost:3000/',
//     failureRedirect: '/auth'
// }))
// app.get('/auth/me', function(req, res) {
//     if(!req.user) {
//         return res.status(401).send('No user logged in.')
//     }
//     return res.status(200).send(req.user);
// })


app.get('/login',
passport.authenticate('auth0', {
    successRedirect: '/followers',
    failureRedirect: '/login',
    failurFlash: true,
    connection: 'github'
})
)

app.get('/followers', (req, res, next) => {
    if(req.user) {
        const FollowerRequest = {
        url: req.user.followers,
        headers: {
          'User-Agent': req.user.clientID
        }
    };
    request(FollowerRequest, (error, response, body) => {
        res.status(200).send(body);
    });

} else {
    res.redirect('/login');
}





const PORT = 4444;

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

})
//install express body-parser cors dotenv express-session
// install passport passport-auth0
//turn off OICD in auth0, add callback