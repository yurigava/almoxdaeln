var orm = require('orm');

module.exports = exports = function(req, res) {
  var equipFamilia = req.body.familia;
  var equipTipo = req.body.tipo;
  var dataInicial = req.body.dataInicial;
  var dataFinal = req.body.dataFinal;
  var tipoVetor = [];
  var patrimonioVetor = [];
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
          res.send({ code: "SUCCESS" , quantidade: 0 , referencia: 0 })
        }
        else {
          req.models.HistoricoEquipamentos.find({EquipamentosMonitorados_patrimonio: patrimonioVetor, timestamp: orm.between(dataInicial + ' 18:50:00', dataFinal + ' 23:00:00')}, function(err, quantidade) {
            if(err)
              res.send(err);
            i++;
            var j=0;
            var max=0;
            quantidade.forEach(function (equip) {
              //console.log("pat: " + pat + " Inicial-final: " + dataInicial +"/"+ dataFinal);
              if(equip.Estados_id_estado === 1) {
                j++;
                //console.log("pat: " + pat + " Inicial-final: " + dataInicial +"/"+ dataFinal + " j: " + j + " quantidade: " + equip.timestamp);
              }      
              if(equip.Estados_id_estado === 4) {
                j--;
              }
              if(j > max) {
                max++;
              }
              console.log("max: " + max + " j: " + j + " quantidade: " + equip.timestamp);
            });
            console.log("max: " + max + " j: "+ j);
            max = 0 ? res.send({ code: "SUCCESS" , quantidade: 0 , referencia: patrimonioVetor.length }) : res.send({ code: "SUCCESS" , quantidade: max , referencia: patrimonioVetor.length })
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
      var j=0;
      var i=0;
      if(patrimonio.length === 0) {
        res.send({ code: "SUCCESS" , quantidade: 0 , referencia: 0 })
      }
      else {
        req.models.HistoricoEquipamentos.find({EquipamentosMonitorados_patrimonio: patrimonioVetor, timestamp: orm.between(dataInicial + ' 18:50:00', dataFinal + ' 23:00:00')}, function(err, quantidade) {
          if(err)
            res.send(err);
          i++;
          var j=0;
          var max=0;
          quantidade.forEach(function (equip) {
            //console.log("pat: " + pat + " Inicial-final: " + dataInicial +"/"+ dataFinal);
            if(equip.Estados_id_estado === 1) {
              j++;
              //console.log("pat: " + pat + " Inicial-final: " + dataInicial +"/"+ dataFinal + " j: " + j + " quantidade: " + equip.timestamp);
            }      
            if(equip.Estados_id_estado === 4) {
              j--;
            }
            if(j > max) {
              max++;
            }
            console.log("max: " + max + " j: " + j + " quantidade: " + equip.timestamp);
          });
          console.log("max: " + max + " j: "+ j);
          max = 0 ? res.send({ code: "SUCCESS" , quantidade: 0 , referencia: patrimonioVetor.length }) : res.send({ code: "SUCCESS" , quantidade: max , referencia: patrimonioVetor.length })
        });
      }
    });
  }
}
