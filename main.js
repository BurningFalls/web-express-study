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

// passport
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
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