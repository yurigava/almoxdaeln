var fs = require('fs');
var url = require('url');
var path = require('path');
var express = require('express');
var app = express();
var router = express.Router();
var mysql = require('mysql');

var contentTypes = {
          'html' : 'text/html',
          'css'  : 'text/css',
          'ico'  : 'image/x-icon',
          'png'  : 'image/png',
          'svg'  : 'image/svg+xml',
          'js'   : 'application/javascript',
          'jpg'  : 'image/jpg',
          'otf'  : 'application/x-font-otf',
          'ttf'  : 'application/x-font-ttf',
          'eot'  : 'application/vnd.ms-fontobject',
          'woff' : 'application/x-font-woff',
          'woff2': 'application/font-woff2',
          'zip'  : 'application/zip'
};

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

app.get('/api/equips', function(req, res) {
  connection.query('SELECT * FROM almoxdaeln_db.Equipments', function (error, results, fields) {
    if (error) throw error;
    //console.log('selected');
    res.json(results);
  });
});

app.get('/api/control', function(req, res) {
  /*connection.query('INSERT INTO almoxdaeln_db.Equipments SET =' + req.body.name, function (error, results, fields) {
    if (error) throw error;
      else res.sendo('success');
      console.log('oi');
  });*/
    console.log('oi');
});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
