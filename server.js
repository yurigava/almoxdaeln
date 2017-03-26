var fs = require('fs');
var url = require('url');
var path = require('path');
var express = require('express');
var passport = require('passport');
var flash    = require('connect-flash');
var session  = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
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

require('./config/passport')(passport); // pass passport for configuration

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
	secret: 'vidyapathaisalwaysrunning',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

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
    res.send(results);
  });
});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});