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
    if(!doesFamiliaExists) {
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
  req.models.EquipamentosMonitorados.get(req.body.patrimonio, function(err, equip) {
    if(err)
      res.send(err);
    else if(equip === null)
      res.send({code: "ER_NOT_FOUND"});
    else {
      if(equip.Estados_id_estado === req.body.estado)
        res.send({code: "ER_SAME_STATE"});
      else {
        req.models.Estados.get(req.body.estado, function(err, estado) {
          equip.setEstado(estado, function(e) {});
          res.send({
            code: "SUCCESS",
            estado: estado.estado,
            familia: equip.Tipo.Familia.familia,
            tipo: equip.Tipo.tipo,
          });
        });
      }
    }
  });
});

app.post('/api/getOrInsertRequisicaoStudentId', function(req,res) {
  var usuario = req.body.usuario;
  req.models.Requisicoes.one(
    { usuario: usuario, EstadosReq_id_estadosReq: 1 },
    function(err, existentRequisicao) {
      if(err)
        res.send(err);
      else if(existentRequisicao)
        res.send({
          code: "SUCCESS",
          idRequisicao: existentRequisicao.id_requisicao,
        });
      else if(req.body.shouldCreate) {
        var requisicao = {
          usuario: req.body.usuario,
          EstadosReq_id_estadosReq: 1,
        };
        req.models.Requisicoes.create(requisicao, function(err, createdRequisicao) {
          if(err)
            res.send(err);
          else
            res.send({
              code: "SUCCESS",
              idRequisicao: createdRequisicao.id_requisicao,
            });
        });
      }
      else {
        res.send({
          code: "ER_NOT_FOUND"
        });
      }
    }
  );
});


function findNotContainedAInB(A, B) {
  var missingElements = [];
  A.forEach(function(elem) {
    if(!B.includes(elem))
      missingElements.push(elem);
  });
  return missingElements;
}

function registerHistoricoEvent(req, res, stateToSet, sendResponse) {
  var patrimonios = req.body.patrimonios;
  var equipsToInsert = [];
  patrimonios.forEach(function(pat) {
    equipsToInsert.push({
      Requisicoes_id_requisicao: req.body.requisicao,
      EquipamentosMonitorados_patrimonio: pat,
    });
  });

  req.models.HistoricoEquipamentos.create(equipsToInsert, function(err) {
    if(err) {
      if(sendResponse)
        res.send(err);
      else
        return -1;
    }
    else {
      req.models.Estados.one({estado: stateToSet}, function(err, state) {
        req.models.EquipamentosMonitorados.find(
          { patrimonio: patrimonios },
          function(err, equips) {
            var registeredEquips = [];
            equips.forEach(function (equip) {
              registeredEquips.push({
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
      });
    }
  });
}

app.post('/api/studentLend', function(req, res) {
  var patrimonios = req.body.patrimonios;
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
          else
            registerHistoricoEvent(req, res, "Emprestado", true);
        }
      }
    }
  );
});

app.post('/api/studentReturn', function(req, res) {
  var patrimonios = req.body.patrimonios;
  var requisicao = req.body.requisicao;
  req.models.HistoricoEquipamentos.find(
    { Requisicoes_id_requisicao: requisicao },
    function (err, equipsInRequest) {
      if(err)
        res.send(err);
      else {
        var patsInRequest = equipsInRequest.map(function (equip) {
          return equip.EquipamentosMonitorados_patrimonio;
        });

        var patsWithCount = {};
        for(var i=0; i < patsInRequest.length; i++) {
          if(!patsWithCount[patsInRequest[i]])
            patsWithCount[patsInRequest[i]] = 0;
          ++patsWithCount[patsInRequest[i]];
        }

        var uniquePats = Object.keys(patsWithCount);
        var uniquePatsNumber = uniquePats.map(function (pat) {
          return Number(pat);
        });
        var notInRequisicao = findNotContainedAInB(patrimonios, uniquePatsNumber);
        if(notInRequisicao.length > 0) {
          res.send({code: "ER_NOT_FOUND", notFound: notInRequisicao});
        }
        else {
          var inUse = uniquePatsNumber.filter(function(pat) {
            return (patsWithCount[pat] % 2) === 1; //Odd number of occurences = still in use
          });
          var notReturned = findNotContainedAInB(inUse, patrimonios);

          registerHistoricoEvent(req, res, "Disponível", false);

          req.models.EstadosReq.one({estadoReq: "Devolvido"}, function(err, state) {
            req.models.Requisicoes.get(Number(requisicao), function (err, requisicaoNode) {
              if(err)
                res.send(err);
              else {
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
                  requisicaoNode.setEstadoReq(state, function(err) {});
                  res.send({code: "SUCCESS"})
                }
              }
            });
          });
        }
      }
    }
  );
});

app.post('/api/insertEquips', function(req, res) {
  var equipsToInsert = [];
  req.body.patrimonios.forEach(function(pat) {
    equipsToInsert.push({
      patrimonio: pat,
      Tipos_id_tipo: req.body.id_tipo,
      Estados_id_estado: 4
    });
  });
  req.models.EquipamentosMonitorados.create(equipsToInsert, function(err) {
    if(err)
      res.send(err);
    else
      res.send('ok');
  });
});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
