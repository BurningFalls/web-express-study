var express = require('express')
var app = express()
var port = 3000
var fs = require('fs');
var template = require('./lib/template.js');
var compression = require('compression');
var topicRouter = require('./routes/topic');

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

app.use('/topic', topicRouter);

app.get('/', (request, response) => {
  var title = 'Welcome';
  var description = 'Hello, Node.js';
  var list = template.list(request.list);
  var html = template.HTML(title, list,
    `<h2>${title}</h2>${description}
    <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px;">
    `,
    `<a href="/topic/create">create</a>`
  );
  response.send(html);
})



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