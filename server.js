require('rootpath')();
var express = require('express');
var port = 9999;

var app = express();
app.use('/', require('./controllers/app.controller'));

var server = app.listen(process.env.PORT || port, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});