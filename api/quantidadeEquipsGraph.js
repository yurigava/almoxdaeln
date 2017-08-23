var orm = require('orm');

module.exports = exports = function(req, res) {
  var equipFamilia = req.body.familia;
  var equipTipo = req.body.tipo;
  var dataInicial = req.body.dataInicial;
  var dataFinal = req.body.dataFinal;
  var tipoVetor = [];
  var patrimonioVetor = [];
  var quantManha = 0;
  var quantTarde = 0;
  var quantNoite = 0;
  var inicioManha = " 06:00:00";
  var finalManha = " 12:00:00";
  var inicioTarde = " 12:00:00";
  var finalTarde = " 18:00:00";
  var inicioNoite = " 18:00:00";
  var finalNoite = " 24:00:00";
  var j=0;
  var max=0;
  console.log("familia: " + equipFamilia + " tipo: " + equipTipo + " mes: " + dataInicial + " ano: " + dataFinal);

  if (equipTipo === null) {
    var quantityTotal = 0;
    req.models.Tipos.find({Familias_id_familia: equipFamilia}, function (err, tipos) {
      if(err)
        res.send(err);
      var tipoVetor = tipos.map(tipo => tipo.id_tipo);
      console.log("tipoVetor: " + tipoVetor);

      req.models.EquipamentosMonitorados.find({Tipos_id_tipo: tipoVetor}, function(err, patrimonio) {
        if(err)
          res.send(err);
        var patrimonioVetor = patrimonio.map(pat => pat.patrimonio);
        console.log("patrimonioVetor: " + patrimonioVetor + " lengt: " + patrimonioVetor.length);
        var i=0;
        if(patrimonio.length === 0) {
          res.send({ code: "SUCCESS" , quantidadeM: 0, quantidadeT: 0, quantidadeN: 0 , referencia: 0 })
        }
        else {
          req.models.HistoricoEquipamentos.find({EquipamentosMonitorados_patrimonio: patrimonioVetor, timestamp: orm.between(dataInicial + inicioManha, dataFinal + finalManha)}, function(err, quantidade) {
            if(err)
              res.send(err);
            i++;
            quantidade.forEach(function (equip) {
              //console.log("pat: " + pat + " Inicial-final: " + dataInicial +"/"+ dataFinal);
              if(equip.Estados_id_estado === 1) {
                j++;
                //console.log("pat: " + pat + " Inicial-final: " + dataInicial +"/"+ dataFinal + " j: " + j + " quantidade: " + equip.timestamp);
              }      
              if(equip.Estados_id_estado === 4) {
                j--;
              }
              else {
                max++;
              }
              console.log("max: " + max + " j: " + j + " quantidade: " + equip.timestamp);
            });
            quantManha = max;
            console.log("max: " + max + " j: "+ j + " quantManha: "+ quantManha);
            max = 0;
            j = 0;
            req.models.HistoricoEquipamentos.find({EquipamentosMonitorados_patrimonio: patrimonioVetor, timestamp: orm.between(dataInicial + inicioTarde, dataFinal + finalTarde)}, function(err, quantidade) {
              if(err)
                res.send(err);
              i++;
              quantidade.forEach(function (equip) {
                //console.log("pat: " + pat + " Inicial-final: " + dataInicial +"/"+ dataFinal);
                if(equip.Estados_id_estado === 1) {
                  j++;
                  //console.log("pat: " + pat + " Inicial-final: " + dataInicial +"/"+ dataFinal + " j: " + j + " quantidade: " + equip.timestamp);
                }      
                if(equip.Estados_id_estado === 4) {
                  j--;
                }
                else {
                  max++;
                }
                console.log("max: " + max + " j: " + j + " quantidade: " + equip.timestamp);
              });
              quantTarde = max;
              console.log("max: " + max + " j: "+ j + " quantManha: "+ quantTarde);
              max = 0;
              j = 0;
              req.models.HistoricoEquipamentos.find({EquipamentosMonitorados_patrimonio: patrimonioVetor, timestamp: orm.between(dataInicial + inicioNoite, dataFinal + finalNoite)}, function(err, quantidade) {
                if(err)
                  res.send(err);
                i++;
                quantidade.forEach(function (equip) {
                  //console.log("pat: " + pat + " Inicial-final: " + dataInicial +"/"+ dataFinal);
                  if(equip.Estados_id_estado === 1) {
                    j++;
                    //console.log("pat: " + pat + " Inicial-final: " + dataInicial +"/"+ dataFinal + " j: " + j + " quantidade: " + equip.timestamp);
                  }      
                  if(equip.Estados_id_estado === 4) {
                    j--;
                  }
                  else {
                    max++;
                  }
                  console.log("max: " + max + " j: " + j + " quantidade: " + equip.timestamp);
                });
                quantNoite = max;
                res.send({ code: "SUCCESS" , quantidadeM: quantManha, quantidadeT: quantTarde, quantidadeN: quantNoite , referencia: patrimonioVetor.length });
              });
            });
          });
        }
      });
    });
  }
  else {
    req.models.EquipamentosMonitorados.find({Tipos_id_tipo: equipTipo}, function(err, patrimonio) {
      if(err)
        res.send(err);
      var patrimonioVetor = patrimonio.map(pat => pat.patrimonio);
      console.log("patrimonioVetor: " + patrimonioVetor);
      var i=0;
      if(patrimonio.length === 0) {
        res.send({ code: "SUCCESS" , quantidadeM: 0, quantidadeT: 0, quantidadeN: 0 , referencia: 0 })
      }
      else {
        req.models.HistoricoEquipamentos.find({EquipamentosMonitorados_patrimonio: patrimonioVetor, timestamp: orm.between(dataInicial + inicioManha, dataFinal + finalManha)}, function(err, quantidade) {
          if(err)
            res.send(err);
          i++;
          quantidade.forEach(function (equip) {
            //console.log("pat: " + pat + " Inicial-final: " + dataInicial +"/"+ dataFinal);
            if(equip.Estados_id_estado === 1) {
              j++;
              //console.log("pat: " + pat + " Inicial-final: " + dataInicial +"/"+ dataFinal + " j: " + j + " quantidade: " + equip.timestamp);
            }      
            if(equip.Estados_id_estado === 4) {
              j--;
            }
            else {
              max++;
            }
            console.log("max: " + max + " j: " + j + " quantidade: " + equip.timestamp);
          });
          quantManha = max;
          console.log("max: " + max + " j: "+ j + " quantManha: "+ quantManha);
          max = 0;
          j = 0;
          req.models.HistoricoEquipamentos.find({EquipamentosMonitorados_patrimonio: patrimonioVetor, timestamp: orm.between(dataInicial + inicioTarde, dataFinal + finalTarde)}, function(err, quantidade) {
            if(err)
              res.send(err);
            i++;
            quantidade.forEach(function (equip) {
              //console.log("pat: " + pat + " Inicial-final: " + dataInicial +"/"+ dataFinal);
              if(equip.Estados_id_estado === 1) {
                j++;
                //console.log("pat: " + pat + " Inicial-final: " + dataInicial +"/"+ dataFinal + " j: " + j + " quantidade: " + equip.timestamp);
              }      
              if(equip.Estados_id_estado === 4) {
                j--;
              }
              else {
                max++;
              }
              console.log("max: " + max + " j: " + j + " quantidade: " + equip.timestamp);
            });
            quantTarde = max;
            console.log("max: " + max + " j: "+ j + " quantManha: "+ quantTarde);
            max = 0;
            j = 0;
            req.models.HistoricoEquipamentos.find({EquipamentosMonitorados_patrimonio: patrimonioVetor, timestamp: orm.between(dataInicial + inicioNoite, dataFinal + finalNoite)}, function(err, quantidade) {
              if(err)
                res.send(err);
              i++;
              quantidade.forEach(function (equip) {
                //console.log("pat: " + pat + " Inicial-final: " + dataInicial +"/"+ dataFinal);
                if(equip.Estados_id_estado === 1) {
                  j++;
                  //console.log("pat: " + pat + " Inicial-final: " + dataInicial +"/"+ dataFinal + " j: " + j + " quantidade: " + equip.timestamp);
                }      
                if(equip.Estados_id_estado === 4) {
                  j--;
                }
                else {
                  max++;
                }
                console.log("max: " + max + " j: " + j + " quantidade: " + equip.timestamp);
              });
              quantNoite = max;
              res.send({ code: "SUCCESS" , quantidadeM: quantManha, quantidadeT: quantTarde, quantidadeN: quantNoite , referencia: patrimonioVetor.length });
            });
          });
        });
      }
    });
  }
}
