var express = require('express')
var app = express()
var port = 3000
var fs = require('fs');
var compression = require('compression');
var helmet = require('helmet');
var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');
var authRouter = require('./routes/auth');
var session = require('express-session');
var FileStore = require('session-file-store')(session); // need to use database

// security
app.use(helmet());
// serving static files (image in 'unsplash')
app.use(express.static('public'));
// body-parser
app.use(express.urlencoded({ extended: false }))
// compression
app.use(compression());
// session
app.use(session({
  secret: 'asadlfkj!@#!@#dfgasdg', // do not share
  resave: false,
  saveUninitialized: true,
  store:new FileStore()
}))

var authData = {
  email:'egoing777@gmail.com',
  password:'111111',
  nickname:'egoing'
}

// passport
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

// call when login success
// store user identifier in session store
passport.serializeUser(function(user, done) {
  console.log('serializeUser', user);
  done(null, user.email);
})

// used when searching for necessary information based on the stored data
passport.deserializeUser(function(id, done) {
  console.log('deserializeUser', id);
  done(null, authData);
})

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'pwd'
  },
  function(username, password, done) {
    if (username === authData.email) {
      if (password === authData.password) {
        return done(null, authData);
      } else {
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
    } else {
      return done(null, false, {
        message: 'Incorrect username.'
      });
    }
  }
));

app.post('/auth/login_process', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login'
}));

// my middleware
app.get('*', (request, response, next) => {
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();
  });
})

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);

// error handling middleware
app.use((request, response, next) => {
  response.status(404).send('Sorry cant find that!');
})
app.use((err, request, response, next) => {
  console.error(err.stack)
  response.status(500).send('Something broke!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})