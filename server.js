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
      res.send(err);
    res.send(familias);
  });
});

app.get('/api/getTipos', function(req, res) {
  req.models.Tipos.find({}, "tipo", function (err, tipos) {
    if(err)
      res.send(err);
    res.send(tipos);
  });
});

app.post('/api/quantidadeReserve', function(req, res) {
  var equipFamilia = req.body.familia;
  var equipTipo = req.body.tipo;
  var name = req.body.name;
  var date = req.body.date;
  var turno = req.body.turno;
  var quantidadeReq = [];
  console.log("familia: " + equipFamilia + " tipo: " + equipTipo + " name: " + name + " date: " + date + " turno: " + turno);

  if (equipTipo === null) {
    var quantityTotal = 0;
    req.models.Tipos.find({Familias_id_familia: req.body.familia}, function (err, tipos) {
      if(err)
        res.send(err);

      tipos.forEach(function (equip) {
        req.models.EquipamentosMonitorados.count({Tipos_id_tipo: equip.id_tipo, Estados_id_estado: 4}, function(err, quantidade) {
          if(err)
            res.send(err);
          quantityTotal = Number(quantityTotal) + Number(quantidade);
        });
      });

      req.models.Requisicoes.find({dataDeUso: date, turno: turno}, function (err, reqs) {
        if(err)
          res.send(err);
        
        reqs.forEach(function (equips) {
          quantidadeReq.push(equips.id_requisicao);
        });
        console.log("vetorID: " + quantidadeReq );

        if(quantidadeReq.length === 0) {
          req.models.EquipamentosRequisicao.find({Requisicoes_id_requisicao: quantidadeReq[0], Familias_id_familia: req.body.familia}, function (err, tipos) {
            if(err)
              res.send(err);
            tipos.forEach(function (equip) {
              quantityTotal = Number(quantityTotal) - Number(equip.quantidade);
              console.log("quantidadeReservada: " + equip.quantidade);
            });
            console.log("quantityTotal: " + quantityTotal);
            quantityTotal > 0 ? res.send({ code: "SUCCESS" , quantidade: quantityTotal, name: req.body.name }) : res.send({ code: "ERROR" , quantidade: 0, name: req.body.name });
          });
        }
        else {
          var i=0;
          quantidadeReq.forEach(function (equips) {
            console.log("vetorquantidadeReq: " + equips);
            req.models.EquipamentosRequisicao.find({Requisicoes_id_requisicao: equips, Familias_id_familia: req.body.familia}, function (err, tipos) {
              if(err)
                res.send(err);
              tipos.forEach(function (equips) {
                quantityTotal = Number(quantityTotal) - Number(equips.quantidade);
                console.log("quantidadeReservada: " + equips.quantidade);
              });
              i++;
              console.log("quantityTotal: " + quantityTotal);
              console.log("i: " + i + " quantidadeReq.length" + quantidadeReq.length);
              if(i>=quantidadeReq.length) {
                quantityTotal > 0 ? res.send({ code: "SUCCESS" , quantidade: quantityTotal, name: req.body.name }) : res.send({ code: "ERROR" , quantidade: 0, name: req.body.name });
              }
              else {}
              //res.send({ code: "SUCCESS" , quantidade: quantityTotal, name: req.body.name });
            });
          });
        }
      });
    });
  }
  else {
    var familyTotal = 0;
    var familyReserve = 0;
    var typeReserve = 0;
    var quantityTotalTipo = 0;
    var quantityTotal = 0;
    req.models.Tipos.find({Familias_id_familia: req.body.familia}, function (err, tipos) {
      if(err)
        res.send(err);

      tipos.forEach(function (equip) {
        req.models.EquipamentosMonitorados.count({Tipos_id_tipo: equip.id_tipo, Estados_id_estado: 4}, function(err, quantidade) {
          if(err)
            res.send(err);
          familyTotal = Number(familyTotal) + Number(quantidade);
          console.log("familyTotal: " + familyTotal);
        });
      });

      req.models.EquipamentosMonitorados.count({Tipos_id_tipo: req.body.tipo, Estados_id_estado: 4}, function(err, quantidade) {
        if(err)
          res.send(err);
        quantityTotalTipo = Number(quantityTotal) + Number(quantidade);
        console.log("quantityTotalTipo: " + quantityTotalTipo);

        req.models.Requisicoes.find({dataDeUso: date, turno: turno}, function (err, reqs) {
          if(err)
            res.send(err);
        
          reqs.forEach(function (equips) {
            quantidadeReq.push(equips.id_requisicao);
          });
          console.log("vetorID: " + quantidadeReq );

          if(quantidadeReq.length === 0) {
            req.models.EquipamentosRequisicao.find({Requisicoes_id_requisicao: quantidadeReq[0], Familias_id_familia: req.body.familia}, function (err, tipos) {
              if(err)
                res.send(err);
              tipos.forEach(function (equip) {
                familyReserve = Number(familyReserve) + Number(equip.quantidade);
                console.log("quantidadeReservada: " + equip.quantidade + " familyReserve: " + familyReserve);
              }); 

              req.models.EquipamentosRequisicao.find({Requisicoes_id_requisicao: quantidadeReq[0], Familias_id_familia: req.body.familia, Tipos_id_tipo: req.body.tipo}, function (err, tipos) {
                if(err)
                  res.send(err);
                tipos.forEach(function (equip) {
                  typeReserve = Number(typeReserve) + Number(equip.quantidade);
                  console.log("typeReserve: " + typeReserve);
                });
                quantityTotal = familyTotal - familyReserve - typeReserve;
                (familyTotal - familyReserve >= quantityTotalTipo - typeReserve) ? quantityTotal = quantityTotalTipo - typeReserve : quantityTotal = familyTotal - familyReserve
                //res.send({ code: "SUCCESS" , quantidade: quantityTotal, name: req.body.name });
                console.log("quantityTotal: " + quantityTotal);
                quantityTotal > 0 ? res.send({ code: "SUCCESS" , quantidade: quantityTotal, name: req.body.name }) : res.send({ code: "ERROR" , quantidade: 0, name: req.body.name });
              });             
            });
          }

          else {
            var i=0;
            quantidadeReq.forEach(function (equips) {
              console.log("vetorquantidadeReq: " + equips);
              req.models.EquipamentosRequisicao.find({Requisicoes_id_requisicao: equips, Familias_id_familia: req.body.familia}, function (err, tipos) {
                if(err)
                  res.send(err);
                tipos.forEach(function (equips) {
                  familyReserve = Number(familyReserve) + Number(equips.quantidade);
                  console.log("quantidadeReservada: " + equips.quantidade + " familyReserve: " + familyReserve);
                });

                req.models.EquipamentosRequisicao.find({Requisicoes_id_requisicao: equips, Familias_id_familia: req.body.familia, Tipos_id_tipo: req.body.tipo}, function (err, tipos) {
                  if(err)
                    res.send(err);
                  tipos.forEach(function (equips) {
                    typeReserve = Number(typeReserve) + Number(equips.quantidade);
                    console.log("typeReserve: " + typeReserve);
                  });
                  quantityTotal = familyTotal - familyReserve - typeReserve;
                  (familyTotal - familyReserve >= quantityTotalTipo - typeReserve) ? quantityTotal = quantityTotalTipo - typeReserve : quantityTotal = familyTotal - familyReserve
                  i++;
                  console.log("quantityTotal: " + quantityTotal);
                  console.log("i: " + i + " quantidadeReq.length" + quantidadeReq.length);
                  if(i>=quantidadeReq.length) {
                    quantityTotal > 0 ? res.send({ code: "SUCCESS" , quantidade: quantityTotal, name: req.body.name }) : res.send({ code: "ERROR" , quantidade: 0, name: req.body.name });
                  }
                  else {}
                });
              });
            });
          }
        });
      });
    });
  }
});

app.post('/api/testeProfessorReserve', function(req, res) {
  var equips = req.body.equips;
  var date = req.body.date;
  var turno = req.body.turno;
  var tamanhoVetor = 0;
  var quantidadeOK = true;
  var quantidadeReq = [];
  console.log("equips.length: " + equips.length);

  for(var i = 0; i < equips.length; i++) {
    //console.log("i: " + i + " tipo: " + equips[i].tipo);
    if(equips[i].tipo === undefined || equips[i].tipo === null) {
      for(var j = 0; j < equips.length; j++) {
        //console.log("j: " + j);
        if(equips[i].familia === equips[j].familia) {
          tamanhoVetor = tamanhoVetor + equips[j].quantidade;
          //console.log("tamanhoVetor: " + tamanhoVetor + " familia: " + equips[j].familia);
        }
        else if(equips[i].familia === equips[j].familia && equips[j].tipo === null){
          tamanhoVetor = tamanhoVetor + equips[j].quantidade;
          //console.log("tamanhoVetor: " + tamanhoVetor + " familia: " + equips[j].familia);
        }
      }
      quantidadeReq.push ({
        familia: equips[i].familia,
        quantidade: tamanhoVetor,
      });
      tamanhoVetor = 0;
      quantidadeReq.forEach(function (equips) {
        console.log("quantidadeReq->familia: " + equips.familia + " quantidade: " + equips.quantidade);
      });
    }
  }

  var i = 0;
  quantidadeReq.forEach(function (equipsfamily) {
    var quantityTotal = 0;
    var quantityFamily = 0;
    //quantityFamily = quantidadeReq[k].quantidade;
    req.models.Tipos.find({Familias_id_familia: equipsfamily.familia}, function (err, tipos) {
      if(err)
        res.send(err);
      else {

      var vetorTipos = tipos.map(tipo => tipo.id_tipo);
      //var patrimoniosInRequest = equipsInRequest.map(equip => equip.EquipamentosMonitorados_patrimonio);
      vetorTipos.forEach(function (equips) {
        console.log("vetorTipo: " + equips);
      });

      //tipos.forEach(function (equip) {
        req.models.EquipamentosMonitorados.count({Tipos_id_tipo: vetorTipos, Estados_id_estado: 4}, function(err, quantidade) {
          if(err)
            res.send(err);
          quantityTotal = Number(quantityTotal) + Number(quantidade);
          console.log("quantityTotal: " + quantityTotal);

          for(k=i;k<i+1;k++) {
            console.log("quantidadeReq: " + quantidadeReq[k].quantidade + " quantityTotal: " + quantityTotal);
            if(quantidadeReq[k].quantidade > quantityTotal && quantidadeOK === true) {
              res.send({ code: "nok" });
              //console.log("nok");
              quantidadeOK = false;
            }
            else if(i>=quantidadeReq.length - 1 && quantidadeOK === true) {
              res.send({ code: "ok" });
              //console.log("ok");
            }
          }
          i++;
        });
      }
    });
  });
  //res.send({ code: "nok" });
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

app.post('/api/updateTipo', function(req, res) {
  var tipoNewName = req.body.tipoNewName;
  var id_familia = req.body.id_familia;
  var id_tipo = req.body.id_tipo;
  req.models.Tipos.exists({ tipo: id_tipo, Familias_id_familia: id_familia }, function(errExists, doesTipoExists) {
    if(errExists)
      res.send(errExists);
    else if(!doesTipoExists) {
      req.models.Tipos.get(id_tipo, function(errGet, oldTipo) {
        if(errGet)
          res.send(errGet);
        else {
          var oldName = oldTipo.tipo;
          oldTipo.tipo = tipoNewName;
          oldTipo.save(function(err) {
            if(err)
              res.send(err);
            else
              res.send({code: "SUCCESS", oldName: oldName, familia: oldTipo.Familia.familia})
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

app.post('/api/getRequisicaoProfessorId', function(req,res) {
  var usuario = req.body.usuario;
  console.log(usuario);
  var date = req.body.date;
  console.log(date);
  var turno = req.body.turno;
  console.log(turno);
  var materia = req.body.materia;
  console.log(materia);
  req.models.Requisicoes.find(
    {
      usuario: usuario,
      dataDeUso: date,
      turno: turno,
      materia: materia,
      EstadosReq_id_estadosReq: 1,
    },
    function(err, existentRequisicao) {
      if(err)
        res.send(err);
      else if(existentRequisicao.length > 0)
        res.send({
          code: "SUCCESS",
          idRequisicao: existentRequisicao[0].id_requisicao,
        });
      else {
        var requisicao = {
          usuario: usuario,      
          dataDeUso: date,
          turno: turno,
          materia: materia,
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
    }
  );
});

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
  req.models.EquipamentosMonitorados.find({patrimonio: patrimonios}, function(err, existingEquipsDb) {
    if(err)
      res.send(err)
    else if (existingEquipsDb.length > 0 && !req.body.changeExistent) {
      var existingEquips = [];
      existingEquipsDb.forEach(function (equip) {
        existingEquips.push({
          pat: equip.patrimonio,
          familia: equip.Tipo.Familia.familia,
          tipo: equip.Tipo.tipo,
        });
      });
      req.models.Tipos.get(req.body.id_tipo, function(errTipo, tipo) {
        if(errTipo)
          res.send(errTipo);
        else {
          res.send({
            code: "WAR_DUP_ENTRY",
            existingEquips: existingEquips,
            newTipo: tipo.tipo,
            newFamilia: tipo.Familia.familia
          });
        }
      });
    }
    else {
      var existingPats = [];
      existingEquipsDb.forEach(function(equip) {
        existingPats.push(equip.patrimonio);
      });
      var equipsToInsert = [];
      var historyEntries = [];
      findNotContainedAInB(patrimonios, existingPats).forEach(function(pat) {
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
            else {
              req.models.Tipos.get(req.body.id_tipo, function(errTipo, tipo) {
                if(errTipo)
                  res.send(errTipo);
                else {
                  existingEquipsDb.forEach(function(equip) {
                    equip.setTipo(tipo, function(e) {});
                  });
                }
                res.send({code: "SUCCESS"});
              });
            }
          });
        }
      });
    }
  });
});

app.post('/api/professorReserve', function(req, res) {
  var requisicao = req.body.requisicao;
  var equips = req.body.equips;
  var reserveToInsert = [];
  req.body.equips.forEach(function(pat) {
    console.log("familia: " + pat.familia + " tipo: " + pat.tipo + " quantidade: " + pat.quantidade);
    if(pat.tipo === null) {
      reserveToInsert.push({
        Requisicoes_id_requisicao: requisicao,
        Familias_id_familia: pat.familia,
        Tipos_id_tipo: null,
        quantidade: pat.quantidade
      });
    }
    else {
      reserveToInsert.push({
        Requisicoes_id_requisicao: requisicao,
        Familias_id_familia: pat.familia,
        Tipos_id_tipo: pat.tipo,
        quantidade: pat.quantidade
      });
    }
  });
  console.log(reserveToInsert);
  req.models.EquipamentosRequisicao.create(reserveToInsert, function(err) {
    if(err)
      res.send(err);
    else
      res.send('ok');
      console.log('oi');
  });
});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
