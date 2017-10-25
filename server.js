var fs = require('fs');
var orm = require('orm');
var url = require('url');
var path = require('path');
var morgan = require('morgan');
var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var LocalStrategy = require('passport-local').Strategy;
var app = express();

var router = express.Router();

var host     = "127.0.0.1";
var database = "almoxdaeln_db";
var username = "jquery";
var password = "Test123!.";

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());

// required for passport
app.use(session({
  secret: 'vidyapathaisalwaysrunning',
  resave: true,
  saveUninitialized: true,
  rolling: true,
  cookie: {
    //secure: true, // Assegura que o navegador só envie o cookie por HTTPS.
    //httpOnly: true, //Assegura que o cookie seja enviado apenas por HTTP(S), não por cliente JavaScript, ajudando assim a se proteger contra ataques de cross-site scripting.
    expires: 6 * 60 * 60 * 1000
  }
} )); // session secret

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.set('port', (process.env.PORT || 8081)); //Requests to / to public
app.use('/', express.static('public'));

app.use(orm.express("mysql://"+ username +":"+ password +"@"+ host +"/"+ database, {
    define: function (db, models, next) {
      db.settings.set("connection.reconnect", true);
      db.load('./src/models/ormModels.js', function(err) {
        for (var model in db.models) {
          if (db.models.hasOwnProperty(model)) {
            models[model] = db.models[model];
          }
        }
      });
      next();
    }
}));


app.use(function(req,res,next) {
  res.header("Access-Control-Allow-Origin", "http://192.168.0.69:8080");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Content-Type", "text/plain");
  next();
});

app.disable('etag');
//Has to be after the app settings
require('./src/authentication.js')(app, passport);

var equipsRoute = require('./api/equips.js');
app.get('/api/equips', equipsRoute);

var getFamiliasRoute = require('./api/getFamilias.js');
app.get('/api/getFamilias', getFamiliasRoute);

var getTiposRoute = require('./api/getTipos.js');
app.get('/api/getTipos', getTiposRoute);

var quantidadeReserveRoute = require('./api/quantidadeReserve.js');
app.post('/api/quantidadeReserve', quantidadeReserveRoute);

var insertFamiliaRoute = require('./api/insertFamilia.js');
app.post('/api/insertFamilia', insertFamiliaRoute);

var updateFamiliaRoute = require('./api/updateFamilia.js');
app.post('/api/updateFamilia', updateFamiliaRoute);

var updateTipoRoute = require('./api/updateTipo.js');
app.post('/api/updateTipo', updateTipoRoute);

var insertTipoRoute = require('./api/insertTipo.js');
app.post('/api/insertTipo', insertTipoRoute);

var getEstadosRoute = require('./api/getEstados.js');
app.get('/api/getEstados', getEstadosRoute);

var updateEquipStateRoute = require('./api/updateEquipState.js');
app.post('/api/updateEquipState', updateEquipStateRoute);

var getRequisicaoProfessorIdRoute = require('./api/getRequisicaoProfessorId.js');
app.post('/api/getRequisicaoProfessorId', getRequisicaoProfessorIdRoute);

var studentLendRoute = require('./api/studentLend.js');
app.post('/api/studentLend', studentLendRoute);

var studentReturnRoute = require('./api/studentReturn.js');
app.post('/api/studentReturn', studentReturnRoute);

var insertEquipsRoute = require('./api/insertEquips.js');
app.post('/api/insertEquips', insertEquipsRoute);

var professorReserveRoute = require('./api/professorReserve.js');
app.post('/api/professorReserve', professorReserveRoute);

var quantidadeEquipsGraphRoute = require('./api/quantidadeEquipsGraph.js');
app.post('/api/quantidadeEquipsGraph', quantidadeEquipsGraphRoute);

var getReserves = require('./api/getReserves.js');
app.post('/api/getReserves', getReserves);

var getReserveDetails = require('./api/getReserveDetails.js');
app.post('/api/getReserveDetails', getReserveDetails);

var getEquipTipo = require('./api/getEquipTipo.js');
app.post('/api/getEquipTipo', getEquipTipo);

var registerReservedEquips = require('./api/registerReservedEquips.js');
app.post('/api/registerReservedEquips', registerReservedEquips);

var getLastReqRoute = require('./api/getLastReq.js');
app.post('/api/getLastReq', getLastReqRoute);

var getCarrinhosRoute = require('./api/getCarrinhos.js');
app.get('/api/getCarrinhos', getCarrinhosRoute);

var getPreparedReserves = require('./api/getPreparedReserves.js');
app.post('/api/getPreparedReserves', getPreparedReserves);

var registerDeliveredReserve = require('./api/registerDeliveredReserve.js');
app.post('/api/registerDeliveredReserve', registerDeliveredReserve);

var getReturnedReserveDetails = require('./api/getReturnedReserveDetails.js');
app.post('/api/getReturnedReserveDetails', getReturnedReserveDetails);

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
