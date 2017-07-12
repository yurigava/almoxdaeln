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

app.post('/api/quantidadeReserve', function(req, res) {
  var equipFamilia = req.body.familia;
  var equipTipo = req.body.tipo;
  var name = req.body.name;
  console.log("familia: " + equipFamilia + " tipo: " + equipTipo + " name: " + name);

  if (equipTipo === null) {
    var quantityTotal = 0;
    req.models.Tipos.find({Familias_id_familia: req.body.familia}, function (err, tipos) {
      if(err)
        throw(err);
        
      tipos.forEach(function (equip) {
        req.models.EquipamentosMonitorados.count({Tipos_id_tipo: equip.id_tipo, Estados_id_estado: 4}, function(err, quantidade) {
          if(err)
            throw(err);
          quantityTotal = Number(quantityTotal) + Number(quantidade);
        });
      });

      req.models.EquipamentosRequisicao.find({Familias_id_familia: req.body.familia}, function (err, tipos) {
        if(err)
          throw(err);
        tipos.forEach(function (equip) {
          quantityTotal = Number(quantityTotal) - Number(equip.quantidade);
        });
        console.log("quantityTotal: " + quantityTotal);
        quantityTotal > 0 ? res.send({ code: "SUCCESS" , quantidade: quantityTotal, name: req.body.name }) : res.send({ code: "ERROR" , quantidade: 0, name: req.body.name }); 
        //res.send({ code: "SUCCESS" , quantidade: quantityTotal, name: req.body.name });     
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
        throw(err);
        
      tipos.forEach(function (equip) {
        req.models.EquipamentosMonitorados.count({Tipos_id_tipo: equip.id_tipo, Estados_id_estado: 4}, function(err, quantidade) {
          if(err)
            throw(err);
          familyTotal = Number(familyTotal) + Number(quantidade);
          console.log("familyTotal: " + familyTotal);
        });
      });
      
      req.models.EquipamentosMonitorados.count({Tipos_id_tipo: req.body.tipo, Estados_id_estado: 4}, function(err, quantidade) {
        if(err)
          throw(err);
        quantityTotalTipo = Number(quantityTotal) + Number(quantidade);
        console.log("quantityTotalTipo: " + quantityTotalTipo);

        req.models.EquipamentosRequisicao.find({Familias_id_familia: req.body.familia}, function (err, familias) {
          if(err)
            throw(err);
          familias.forEach(function (equip) {
            familyReserve = Number(familyReserve) + Number(equip.quantidade);
            console.log("familyReserve: " + familyReserve);
          });
          
          req.models.EquipamentosRequisicao.find({Familias_id_familia: req.body.familia, Tipos_id_tipo: req.body.tipo}, function (err, tipos) {
            if(err)
              throw(err);
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
      });
    });
  }
});

app.post('/api/testeProfessorReserve', function(req, res) {
  var equips = req.body.equips;
  var tamanhoVetor = 0;
  var quantidadeOK = false;
  equips.forEach(function (equip) {
    console.log(equip.familia+"/"+equip.tipo+"/"+equip.quantidade);//1

    if (equip.tipo === null) {
      var quantityTotal = "";
      req.models.Tipos.find({Familias_id_familia: equip.familia}, function (err, tipos) {
        if(err)
          throw(err);

        tipos.forEach(function (equips) {
          req.models.EquipamentosMonitorados.count({Tipos_id_tipo: equips.id_tipo, Estados_id_estado: 4}, function(err, quantidade) {
            if(err)
              throw(err);
            quantityTotal = Number(quantityTotal) + Number(quantidade);
          });
        });

        req.models.EquipamentosRequisicao.find({Familias_id_familia: equip.familia}, function (err, tipos) {
          if(err)
            throw(err);

          tipos.forEach(function (equips) {
            quantityTotal = Number(quantityTotal) - Number(equips.quantidade);
          });
          //inicio   
          tamanhoVetor = tamanhoVetor + 1;
          console.log("tamanhoVetor: "+tamanhoVetor + " req.body.equips.length: " + req.body.equips.length);
          if(quantityTotal < equip.quantidade) {
            quantidadeOK = false;
            //res.send({ code: "nok" });
            //return;
          }
          else { quantidadeOK = true; console.log("passou aqui"); }

          if (tamanhoVetor < req.body.equips.length) {
            console.log("tem mais vetor");
          }
          else {
            quantidadeOK === true ? res.send({ code: "ok" }) : res.send({ code: "nok" })
          }
        //res.send({ code: "SUCCESS" , quantidade: quantityTotal, name: req.body.name });     
        });   
      });
      console.log("quantidadeOK: " + quantidadeOK);//3
      //quantidadeOK === true ? res.send({ code: "ok" }) : res.send({ code: "nok" })
    }
    else {
      var familyTotal = "";
      var familyReserve = "";
      var typeReserve = "";
      var quantityTotalTipo = "";
      var quantityTotal = ""; 

      req.models.Tipos.find({Familias_id_familia: equip.familia}, function (err, tipos) {
        if(err)
          throw(err);

        tipos.forEach(function (equips) {
          req.models.EquipamentosMonitorados.count({Tipos_id_tipo: equips.id_tipo, Estados_id_estado: 4}, function(err, quantidade) {
            if(err)
              throw(err);
            familyTotal = Number(familyTotal) + Number(quantidade);
            console.log("familyTotal: " + familyTotal);
          });
        });

        req.models.EquipamentosMonitorados.count({Tipos_id_tipo: equip.tipo, Estados_id_estado: 4}, function(err, quantidade) {
          if(err)
            throw(err);
          quantityTotalTipo = Number(quantityTotal) + Number(quantidade);
          console.log("quantityTotalTipo: " + quantityTotalTipo);
          
          req.models.EquipamentosRequisicao.find({Familias_id_familia: equip.familia}, function (err, familias) {
            if(err)
              throw(err);
            familias.forEach(function (equips) {
              familyReserve = Number(familyReserve) + Number(equips.quantidade);
              console.log("familyReserve: " + familyReserve);
            });
          
            req.models.EquipamentosRequisicao.find({Familias_id_familia: equip.familia, Tipos_id_tipo: equip.tipo}, function (err, tipos) {
              if(err)
                throw(err);
              tipos.forEach(function (equips) {
                typeReserve = Number(typeReserve) + Number(equips.quantidade);
                console.log("typeReserve: " + typeReserve);
              });
              //inicio
              quantityTotal = familyTotal - familyReserve - typeReserve;
              (familyTotal - familyReserve >= quantityTotalTipo - typeReserve) ? quantityTotal = quantityTotalTipo - typeReserve : quantityTotal = familyTotal - familyReserve
              console.log("quantityTotal: " + quantityTotal);

              tamanhoVetor = tamanhoVetor + 1;
              console.log("tamanhoVetor: "+tamanhoVetor + " req.body.equips.length: " + req.body.equips.length);

              if(quantityTotal < equip.quantidade) {
                quantidadeOK = false;
                //res.send({ code: "nok" });
                //return;
              }
              else { quantidadeOK = true; console.log("passou aqui"); }

              if (tamanhoVetor < req.body.equips.length) {
                console.log("tem mais vetor");
              }
              else {
                quantidadeOK === true ? res.send({ code: "ok" }) : res.send({ code: "nok" })
              }
            });
          });
        });
      });
    }
  });
  //console.log("quantidade: " + quantityTotal + " - disponivel: " + quant);//5
  //quantidadeOK === true ? res.send({ code: "ok" }) : res.send({ code: "nok" })
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

app.post('/api/getRequisicaoStudentId', function(req,res) {
  var usuario = req.body.usuario;
  req.models.Requisicoes.find(
    { usuario: usuario, EstadosReq_id_estadosReq: 1 },
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
    }
  );
});

app.post('/api/getRequisicaoProfessorId', function(req,res) {
  var usuario = req.body.usuario;
  console.log(usuario);
  var date = req.body.date;
  var materia = req.body.materia;
  console.log(materia);
  req.models.Requisicoes.find(
    { 
      usuario: usuario, 
      timestampDeUso: date, 
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
          timestampDeUso: date, 
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
  req.models.EquipamentosMonitorados.find(
    { patrimonio: patrimonios },
    function (err, equips) {
      if(err)
        res.send(err);
      else {
        var foundEquipsNumber = equips.map(function (equip) {
          return equip.patrimonio;
        });
        var missing = findMissingElements(patrimonios, foundEquipsNumber)
        if(missing.length > 0)
          res.send({code: "ER_NOT_FOUND", notFound: missing});
        else {
          notAvailableEquips = [];
          var foundEquipsState = equips.forEach(function (equip) {
            if(equip.Estado.estado !== "Disponível")
              notAvailableEquips.push(equip.patrimonio);
          });
          if(notAvailableEquips.length > 0)
            res.send({code: "ER_NOT_AVAILABLE", notAvailable: notAvailableEquips});
          else
            registerHistoricoEvent(req, res);
        }
      }
    }
  );
});

function findMissingElements(all, part) {
  var missingElements = [];
  all.forEach(function(elem) {
    if(!part.includes(elem))
      missingElements.push(elem);
  });
  return missingElements;
}

function registerHistoricoEvent(req, res) {
  var patrimonios = req.body.patrimonios;
  var equipsToInsert = [];
  patrimonios.forEach(function(pat) {
    equipsToInsert.push({
      Requisicoes_id_requisicao: req.body.requisicao,
      EquipamentosMonitorados_patrimonio: pat,
    });
  });
  req.models.HistoricoEquipamentos.create(equipsToInsert, function(err) {
    if(err)
      res.send(err);
    else {
      var lentEquips = [];
      var estadoEmprestado
      req.models.Estados.find({estado: "Emprestado"}, function(err, emprestado) {
        estadoEmprestado = emprestado[0];
      });
      req.models.EquipamentosMonitorados.find(
        { patrimonio: patrimonios },
        function(err, equips) {
          for(var i = 0; i < equips.length; i++) {
            lentEquips.push({
              familia: equips[i].Tipo.Familia.familia,
              tipo: equips[i].Tipo.tipo,
            });
            equips[i].setEstado(estadoEmprestado, function(err) {});
          }
          res.send({code: "SUCCESS", lentEquips: lentEquips});
        }
      );
    }
  });
}

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
