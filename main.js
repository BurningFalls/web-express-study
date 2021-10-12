var express = require('express')
var app = express()
var port = 3000
var fs = require('fs');
var compression = require('compression');
var helmet = require('helmet');
var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');

// security
app.use(helmet());
// serving static files (image in 'unsplash')
app.use(express.static('public'));
// body-parser
app.use(express.urlencoded({ extended: false }))
// compression
app.use(compression());
// my middleware
app.get('*', (request, response, next) => {
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();
  });
})

app.use('/', indexRouter);
app.use('/topic', topicRouter);

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