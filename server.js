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

var protocol = "mysql";
var query    = { pool: true };
var host     = "127.0.0.1";
var database = "almoxdaeln_db";
var username = "jquery";
var password = "Test123!.";

var sqlQueryGetLentEquips = `SELECT EquipamentosMonitorados_patrimonio FROM
    (SELECT t1.EquipamentosMonitorados_patrimonio, t1.Estados_id_estado, t1.usuario FROM HistoricoEquipamentos t1
      JOIN (
        SELECT EquipamentosMonitorados_patrimonio, usuario, MAX(timestamp) timestamp
        FROM HistoricoEquipamentos
        WHERE usuario = ?
        GROUP BY EquipamentosMonitorados_patrimonio
      ) t2
    ON t1.EquipamentosMonitorados_patrimonio = t2.EquipamentosMonitorados_patrimonio
    AND t1.timestamp = t2.timestamp
    AND t1.usuario = t2.usuario) LastStates
  WHERE
    Estados_id_estado = 1`;

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());

var expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour

// required for passport
app.use(session({
  secret: 'vidyapathaisalwaysrunning',
  resave: true,
  saveUninitialized: true,
  cookie: {
    //secure: true, // Assegura que o navegador só envie o cookie por HTTPS.
    //httpOnly: true, //Assegura que o cookie seja enviado apenas por HTTP(S), não por cliente JavaScript, ajudando assim a se proteger contra ataques de cross-site scripting.
    expires: expiryDate
  }
} )); // session secret

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


app.set('port', (process.env.PORT || 8081)); //Requests to / to public
app.use('/', express.static('public'));

app.use(orm.express("mysql://"+ username +":"+ password +"@"+ host +"/"+ database, {
    define: function (db, models, next) {
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

app.get('/api/equips', function(req, res) {
  req.models.EquipamentosMonitorados.find({}, function (err, equipamentos) {
    res.send(equipamentos);
  });
});

app.get('/api/getFamilias', function(req, res) {
  req.models.Familias.find({}, "familia", function (err, familias) {
    if(err)
      throw(err);
    res.send(familias);
  });
});

app.get('/api/getTipos', function(req, res) {
  req.models.Tipos.find({}, "tipo", function (err, tipos) {
    if(err)
      throw(err);
    res.send(tipos);
  });
});

app.post('/api/insertFamilia', function(req, res) {
  req.models.Familias.exists(req.body, function(errExists, doesFamiliaExists) {
    if(errExists)
      res.send(errExists);
    else if(!doesFamiliaExists) {
      req.models.Familias.create(req.body, function(errCreate, familia) {
        if(errCreate)
          res.send(errCreate);
        else {
          res.send({
            id_familia: familia.id_familia,
            code: "SUCCESS"
          });
        }
      });
    }
    else { //Familia Exists
      res.send({ code: "ER_DUP_ENTRY" });
    }
  });
});

app.post('/api/updateFamilia', function(req, res) {
  var familiaNewName = req.body.familiaNewName;
  var familia = req.body.familia;
  req.models.Familias.exists({familia: familiaNewName}, function(errExists, doesFamiliaExists) {
    if(errExists)
      res.send(errExists);
    else if(!doesFamiliaExists) {
      req.models.Familias.get(familia, function(errGet, oldFamilia) {
        if(errGet)
          res.send(errGet);
        else {
          var oldName = oldFamilia.familia;
          oldFamilia.familia = familiaNewName;
          oldFamilia.save(function(err) {
            if(err)
              res.send(err);
            else
              res.send({code: "SUCCESS", oldName: oldName})
          });
        }
      });
    }
    else {
      res.send({code: "ER_DUP_ENTRY"})
    }
  });
});

app.post('/api/insertTipo', function(req, res) {
  var tipo = req.body.tipo;
  var familia = req.body.Familias_id_familia;
  req.models.Tipos.exists({ tipo: tipo, Familias_id_familia: familia }, function(err, doesTipoExists) {
    if(!doesTipoExists) {
      req.models.Tipos.create(req.body, function(err) {
        if(err)
          res.send(err);
        else
          res.send('ok');
      });
    }
    else {
      res.send({ code: "ER_DUP_ENTRY" });
    }
  });
});

app.get('/api/getEstados', function(req, res) {
  req.models.Estados.find({}, function(err, estados) {
    if(err)
      res.send(err);
    else
      res.send(estados);
  });
});

app.post('/api/updateEquipState', function(req, res) {
  var usuario = req.body.usuario;
  var patrimonio = req.body.patrimonio;
  var reqEstado = req.body.estado;
  var observacao = req.body.observacao;
  req.models.EquipamentosMonitorados.get(patrimonio, function(err, equip) {
    if(!equip)
      res.send({code: "ER_NOT_FOUND"});
    else if(err)
      res.send(err);
    else {
      if(equip.Estados_id_estado === reqEstado)
        res.send({code: "ER_SAME_STATE"});
      else {
        req.models.Estados.get(reqEstado, function(err, estado) {
          equip.setEstado(estado, function(e) {});
          var eventsToCreate = [{
            observacao: observacao,
            usuario: usuario,
            EquipamentosMonitorados_patrimonio: patrimonio,
            Estados_id_estado: estado.id_estado
          }];
          req.models.HistoricoEquipamentos.one( //If equip is lent, fix user pendency
            {
              EquipamentosMonitorados_patrimonio: patrimonio,
              Estados_id_estado: 1
            },
            ["timestamp", "Z"],
            1,
            function (err, lastEvent) {
              if(lastEvent.length !== null)
                eventsToCreate.unshift({
                  observacao: "Situação Regularizada",
                  usuario: lastEvent.usuario,
                  EquipamentosMonitorados_patrimonio: patrimonio,
                  Estados_id_estado: 4
                });
              req.models.HistoricoEquipamentos.create(eventsToCreate, function(err) {
                if(err)
                  res.send(err);
                else
                  res.send({
                    code: "SUCCESS",
                    estado: estado.estado,
                    familia: equip.Tipo.Familia.familia,
                    tipo: equip.Tipo.tipo,
                  });
              });
            }
          );
        });
      }
    }
  });
});

function findNotContainedAInB(A, B) {
  var missingElements = [];
  A.forEach(function(elem) {
    if(!B.includes(elem))
      missingElements.push(elem);
  });
  return missingElements;
}

function changeEquipState(req, res, stateToSet, sendResponse) {
  var patrimonios = req.body.patrimonios;
  var observacao = req.body.observacao;
  var usuario = req.body.usuario;
  var equipsToRegister = [];

  req.models.Estados.one({estado: stateToSet}, function(err, state) {
    patrimonios.forEach(function(pat) {
      equipsToRegister.push({
        observacao: observacao,
        usuario: usuario,
        Estados_id_estado: state.id_estado,
        EquipamentosMonitorados_patrimonio: pat,
      });
    });
    req.models.HistoricoEquipamentos.create(equipsToRegister, function(err) {
      if(err) {
        if(sendResponse)
          res.send(err);
        else
          return -1;
      }
      else {
        req.models.EquipamentosMonitorados.find(
          { patrimonio: patrimonios },
          function(err, equips) {
            var registeredEquips = [];
            equips.forEach(function (equip) {
              registeredEquips.push({
                pat: equip.patrimonio,
                familia: equip.Tipo.Familia.familia,
                tipo: equip.Tipo.tipo,
              });
              equip.setEstado(state, function(err) {});
            });
            if(sendResponse)
              res.send({code: "SUCCESS", registeredEquips: registeredEquips});
            else
              return 1;
          }
        );
      }
    });
  });
}

app.post('/api/studentLend', function(req, res) {
  var patrimonios = req.body.patrimonios;
  var usuario = req.body.usuario;
  var shouldAddToRequest = req.body.shouldAddToRequest;
  req.models.EquipamentosMonitorados.find(
    { patrimonio: patrimonios },
    function (err, equips) {
      if(err)
        res.send(err);
      else {
        var foundEquipsNumber = equips.map(function (equip) {
          return equip.patrimonio;
        });
        var missingInDB = findNotContainedAInB(patrimonios, foundEquipsNumber)
        if(missingInDB.length > 0)
          res.send({code: "ER_NOT_FOUND", notFound: missingInDB});
        else {
          notAvailableEquips = [];
          var foundEquipsState = equips.forEach(function (equip) {
            if(equip.Estado.estado !== "Disponível")
              notAvailableEquips.push(equip.patrimonio);
          });
          if(notAvailableEquips.length > 0)
            res.send({code: "ER_NOT_AVAILABLE", notAvailable: notAvailableEquips});
          else {
            req.db.driver.execQuery(sqlQueryGetLentEquips, [usuario], function (err, equipsInRequest) {
              if(err)
                res.send(err);
              else if(!shouldAddToRequest && equipsInRequest.length > 0) {
                var alreadyLentPats = equipsInRequest.map(equip => equip.EquipamentosMonitorados_patrimonio);
                req.models.EquipamentosMonitorados.find({patrimonio: alreadyLentPats}, function(err, equips) {
                  if(err)
                    res.send(err);
                  var alreadyLentInfo = [];
                  equips.forEach(function (equip) {
                    if(equip.Estado.estado === "Emprestado")
                      alreadyLentInfo.push({
                        pat: equip.patrimonio,
                        familia: equip.Tipo.Familia.familia,
                        tipo: equip.Tipo.tipo,
                      });
                  });
                  if(alreadyLentInfo.length > 0)
                    res.send({code: "WAR_ALREADY_LENT", alreadyLentEquips: alreadyLentInfo});
                  else
                    changeEquipState(req, res, "Emprestado", true);
                });
              }
              else
                changeEquipState(req, res, "Emprestado", true);
            });
          }
        }
      }
    }
  );
});

app.post('/api/studentReturn', function(req, res) {
  var patrimoniosReturning = req.body.patrimonios;
  var usuario = req.body.usuario;
  req.db.driver.execQuery(
    sqlQueryGetLentEquips,
    [usuario],
    function (err, equipsInRequest) {
      if(err)
        res.send(err);
      else {
        var patrimoniosInRequest = equipsInRequest.map(equip => equip.EquipamentosMonitorados_patrimonio);
        var notInRequisicao = findNotContainedAInB(patrimoniosReturning, patrimoniosInRequest);
        if(notInRequisicao.length > 0)
          res.send({code: "ER_NOT_FOUND", notFound: notInRequisicao});
        else {
          var notReturned = findNotContainedAInB(patrimoniosInRequest, patrimoniosReturning);

          changeEquipState(req, res, "Disponível", false);

          if(notReturned.length > 0) {
            req.models.EquipamentosMonitorados.find({patrimonio: notReturned}, function(err, equips) {
              if(err)
                res.send(err);
              var notReturnedInfo = [];
              equips.forEach(function (equip) {
                notReturnedInfo.push({
                  pat: equip.patrimonio,
                  familia: equip.Tipo.Familia.familia,
                  tipo: equip.Tipo.tipo,
                });
              });
              res.send({code: "WAR_MISSING_EQUIPS", missingEquips: notReturnedInfo});
            });
          }
          else {
            res.send({code: "SUCCESS"})
          }
        }
      }
    }
  );
});

app.post('/api/insertEquips', function(req, res) {
  var patrimonios = req.body.patrimonios;
  req.models.EquipamentosMonitorados.find({patrimonio: patrimonios}, function(err, existentPats) {
    if(err)
      res.send(err)
    else if (existentPats.length > 0) {
      var existentEquipsNumber = existentPats.map(function (equip) {
        return equip.patrimonio;
      });
      res.send({
        code: "ER_DUP_ENTRY",
        notFound: existentEquipsNumber
      });
    }
    else {
      var equipsToInsert = [];
      var historyEntries = [];
      patrimonios.forEach(function(pat) {
        equipsToInsert.push({
          patrimonio: pat,
          Tipos_id_tipo: req.body.id_tipo,
          Estados_id_estado: 4
        });
        historyEntries.push({
          observacao: "Criação",
          usuario: req.body.usuario,
          EquipamentosMonitorados_patrimonio: pat,
          Estados_id_estado: 4
        });
      });
      req.models.EquipamentosMonitorados.create(equipsToInsert, function(err) {
        if(err)
          res.send(err);
        else {
          req.models.HistoricoEquipamentos.create(historyEntries, function(err) {
            if(err)
              res.send(err);
            else
              res.send({code: "SUCCESS"});
          });
        }
      });
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
