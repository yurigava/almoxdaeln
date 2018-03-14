var orm = require('orm');

module.exports = exports = function(req, res) {
  var equipFamilia = req.body.familia;
  var equipTipo = req.body.tipo;
  var dataInicial = req.body.dataInicial;
  var dataFinal = req.body.dataFinal;
  var tipoVetor, patrimonioVetor = [];
  var quantManha = 0;
  var quantTarde = 0;
  var quantNoite = 0;
  var inicioHora = " 06:00:00";
  var finalHora = " 23:00:00";
  var inicioManha = "06:00:00";
  var finalManha = "12:00:00";
  var inicioTarde = "12:00:00";
  var finalTarde = "18:00:00";
  var inicioNoite = "18:00:00";
  var finalNoite = "23:00:00";
  var j, maxM, maxT, maxN=0;
  //console.log("familia: " + equipFamilia + " tipo: " + equipTipo + " mes: " + dataInicial + " ano: " + dataFinal);

  if (equipTipo === null) {
    var quantityTotal = 0;
    req.models.Tipos.find({Familias_id_familia: equipFamilia}, function (err, tipos) {
      if(err)
        res.send(err);
      var tipoVetor = tipos.map(tipo => tipo.id_tipo);
      //console.log("tipoVetor: " + tipoVetor);

      req.models.EquipamentosMonitorados.find({Tipos_id_tipo: tipoVetor}, function(err, patrimonio) {
        if(err)
          res.send(err);
        var patrimonioVetor = patrimonio.map(pat => pat.patrimonio);
        console.log("patrimonioVetor: " + patrimonioVetor + " lengt: " + patrimonioVetor.length);        
        if(patrimonio.length === 0) {
          res.send({ code: "SUCCESS" , quantidade: [0, 0, 0] , referencia: 0 })
        }
        else {
          req.models.HistoricoEquipamentos.find({EquipamentosMonitorados_patrimonio: patrimonioVetor, timestamp: orm.between(dataInicial + inicioHora, dataFinal + finalHora)}, function(err, quantidade) {
            if(err)
              res.send(err);
            var dataProx = "";
            quantidade.forEach(function (equip) {
              var data = equip.timestamp;
              var zerar = false;
              dataAtual = (data.getFullYear() + '-' + ("0" + (data.getMonth()+1)).slice(-2) + '-' + ("0" + data.getDate()).slice(-2));
              tempoAtual = (("0" + (data.getHours())).slice(-2) + ':' + ("0" + (data.getMinutes())).slice(-2) + ':' + ("0" + data.getSeconds()).slice(-2));
              //console.log("dataAtual: " + dataAtual + " tempoAtual: " + tempoAtual + " data: " + data);
              if(dataProx !== dataAtual) {
                dataProx = dataAtual;
                maxM = 0;
                maxT = 0;
                maxN = 0;
                j = 0;
                zerar = true;
              }
              if(zerar = true || dataProx !== dataAtual) {
                if(tempoAtual >= inicioManha && tempoAtual <= finalManha) {
                  equip.Estados_id_estado === 1 ? j++ : j
                  equip.Estados_id_estado === 4 ? j-- : maxM++; quantManha = maxM
                }
                if(tempoAtual >= inicioTarde && tempoAtual <= finalTarde) {
                  equip.Estados_id_estado === 1 ? j++ : j
                  equip.Estados_id_estado === 4 ? j-- : maxT++; quantTarde = maxT
                }
                if(tempoAtual >= inicioNoite && tempoAtual <= finalNoite) {
                  equip.Estados_id_estado === 1 ? j++ : j
                  equip.Estados_id_estado === 4 ? j-- : maxN++; quantNoite = maxN
                }
              }
              dataProx = dataAtual;
              //console.log("j: " +j+ " QuantManha: "+ quantManha + " QuantTarde: " + quantTarde + " QuantNoite: "+ quantNoite);
            });
            console.log("QuantManha: "+ quantManha + " QuantTarde: " + quantTarde + " QuantNoite: "+ quantNoite);
            res.send({ code: "SUCCESS" , quantidade: [quantManha, quantTarde, quantNoite] , referencia: patrimonioVetor.length });
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
      if(patrimonio.length === 0) {
        res.send({ code: "SUCCESS" , quantidade: [0, 0, 0] , referencia: 0 })
      }
      else {
        req.models.HistoricoEquipamentos.find({EquipamentosMonitorados_patrimonio: patrimonioVetor, timestamp: orm.between(dataInicial + inicioHora, dataFinal + finalHora)}, function(err, quantidade) {
          if(err)
            res.send(err);
          var dataProx = "";
          quantidade.forEach(function (equip) {
            var data = equip.timestamp;
            var zerar = false;
            dataAtual = (data.getFullYear() + '-' + ("0" + (data.getMonth()+1)).slice(-2) + '-' + ("0" + data.getDate()).slice(-2));
            tempoAtual = (("0" + (data.getHours())).slice(-2) + ':' + ("0" + (data.getMinutes())).slice(-2) + ':' + ("0" + data.getSeconds()).slice(-2));
            //console.log("dataAtual: " + dataAtual + " tempoAtual: " + tempoAtual + " data: " + data);
            if(dataProx !== dataAtual) {
              dataProx = dataAtual;
              maxM = 0;
              maxT = 0;
              maxN = 0;
              j = 0;
              zerar = true;
            }
            if(zerar = true || dataProx !== dataAtual) {
              if(tempoAtual >= inicioManha && tempoAtual <= finalManha) {
                equip.Estados_id_estado === 1 ? j++ : j
                equip.Estados_id_estado === 4 ? j-- : maxM++; quantManha = maxM
              }
              if(tempoAtual >= inicioTarde && tempoAtual <= finalTarde) {
                equip.Estados_id_estado === 1 ? j++ : j
                equip.Estados_id_estado === 4 ? j-- : maxT++; quantTarde = maxT
              }
              if(tempoAtual >= inicioNoite && tempoAtual <= finalNoite) {
                equip.Estados_id_estado === 1 ? j++ : j
                equip.Estados_id_estado === 4 ? j-- : maxN++; quantNoite = maxN
              }
            }
            dataProx = dataAtual;
            //console.log("j: " +j+ " QuantManha: "+ quantManha + " QuantTarde: " + quantTarde + " QuantNoite: "+ quantNoite);
          });
          console.log("QuantManha: "+ quantManha + " QuantTarde: " + quantTarde + " QuantNoite: "+ quantNoite);
          res.send({ code: "SUCCESS" , quantidade: [quantManha, quantTarde, quantNoite] , referencia: patrimonioVetor.length });
        });
      }
    });
  }
}
