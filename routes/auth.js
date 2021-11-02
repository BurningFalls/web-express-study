var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');

// do not share
var authData = {
  email:'egoing777@gmail.com',
  password:'111111',
  nickname:'egoing'
}

router.get('/login', (request, response) => {
  var title = 'WEB - login';
  var list = template.list(request.list);
  var html = template.HTML(title, list, `
    <form action="/auth/login_process" method="post">
      <p><input type="text" name="email" placeholder="email"></p>
      <p><input type="password" name="pwd" placeholder="password"></p>
      <p>
        <input type="submit" value="login">
      </p>
    </form>
  `, '');
  response.send(html);
})

router.post('/login_process', (request, response) => {
  var post = request.body;
  var email = post.email;
  var password = post.pwd;
  if (email === authData.email && password === authData.password) {
    request.session.is_logined = true;
    request.session.nickname = authData.nickname;
    request.session.save(function() {
      response.redirect(`/`);
    });
  } else {
    response.send('Who?');
  }
})

router.get('/logout', (request, response) => {
  request.session.destroy(function(err) {
    response.redirect(`/`);
  })
})

module.exports = router;