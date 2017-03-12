var fs = require('fs');
var url = require('url');
var path = require('path');
var express = require('express');
var app = express();

var router = express.Router();

var mysql = require('mysql');

var connection = mysql.createConnection({
    host    : '127.0.0.1',
    user    : 'jquery',
    password: 'Test123!.',
    database: 'almoxdaeln_db'
});

connection.connect(function (err) {
    if (err) {
        console.log(err);
    }
});

app.set('port', (process.env.PORT || 8081));
//Requests to / to public
app.use('/', express.static('public'));

app.use(function(req,res,next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.disable('etag');

app.get('/api/equips', function(req, res) {
  connection.query('SELECT * FROM almoxdaeln_db.Equipments', function (error, results, fields) {
    if (error) throw error;
		console.log('Received request on /api/equips')
    res.send({fields: fields, results: results});
  });
});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
