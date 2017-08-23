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
  var inicioHora = " 06:00:00";
  var finalHora = " 23:00:00";
  var inicioManha = "06:00:00";
  var finalManha = "12:00:00";
  var inicioTarde = "12:00:00";
  var finalTarde = "18:00:00";
  var inicioNoite = "18:00:00";
  var finalNoite = "23:00:00";
  var j=0;
  var max=0;
  var d = new Date();
  x = d.getMonth();
  console.log("mes: " + d.getMonth());
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
          res.send({ code: "SUCCESS" , quantidade: [0, 0, 0] , referencia: 0 })
        }
        else {
          req.models.HistoricoEquipamentos.find({EquipamentosMonitorados_patrimonio: patrimonioVetor, timestamp: orm.between(dataInicial + inicioHora, dataFinal + finalHora)}, function(err, quantidade) {
            if(err)
              res.send(err);
            i++;
            quantidade.forEach(function (equip) {
              var data = equip.timestamp;
              var dataProx = "";
              dataAtual = (data.getFullYear() + '-' + ("0" + (data.getMonth()+1)).slice(-2) + '-' + ("0" + data.getDate()).slice(-2));
              dataProx = dataAtual;
              tempoAtual = (("0" + (data.getHours())).slice(-2) + ':' + ("0" + (data.getMinutes())).slice(-2) + ':' + ("0" + data.getSeconds()).slice(-2));
              console.log("dataAtual: " + dataAtual + " tempoAtual: " + tempoAtual + " data: " + data);
              if(dataProx !== dataAtual) {
                dataProx = dataAtual;
                max = 0;
                j = 0;
              }
              else {
                if(tempoAtual >= inicioManha && tempoAtual <= finalManha) {
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
                    quantManha <= max ? quantManha = max : quantManha = quantManha;
                  }
                }
                else if(tempoAtual >= inicioTarde && tempoAtual <= finalTarde) {
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
                    quantTarde <= max ? quantTarde = max : quantTarde = quantTarde;
                  }
                }
                else if(tempoAtual >= inicioNoite && tempoAtual <= finalNoite) {
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
                    quantNoite <= max ? quantNoite = max : quantNoite = quantNoite;
                  }
                }
              }
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
      var i=0;
      if(patrimonio.length === 0) {
        res.send({ code: "SUCCESS" , quantidade: [0, 0, 0] , referencia: 0 })
      }
      else {
        req.models.HistoricoEquipamentos.find({EquipamentosMonitorados_patrimonio: patrimonioVetor, timestamp: orm.between(dataInicial + inicioHora, dataFinal + finalHora)}, function(err, quantidade) {
          if(err)
            res.send(err);
          i++;
          quantidade.forEach(function (equip) {
            var data = equip.timestamp;
            var dataProx = "";
            dataAtual = (data.getFullYear() + '-' + ("0" + (data.getMonth()+1)).slice(-2) + '-' + ("0" + data.getDate()).slice(-2));
            dataProx = dataAtual;
            tempoAtual = (("0" + (data.getHours())).slice(-2) + ':' + ("0" + (data.getMinutes())).slice(-2) + ':' + ("0" + data.getSeconds()).slice(-2));
            console.log("dataAtual: " + dataAtual + " tempoAtual: " + tempoAtual + " data: " + data);
            if(dataProx !== dataAtual) {
              dataProx = dataAtual;
              max = 0;
              j = 0;
            }
            else {
              if(tempoAtual >= inicioManha && tempoAtual <= finalManha) {
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
                  quantManha <= max ? quantManha = max : quantManha = quantManha;
                }
              }
              else if(tempoAtual >= inicioTarde && tempoAtual <= finalTarde) {
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
                  quantTarde <= max ? quantTarde = max : quantTarde = quantTarde;
                }
              }
              else if(tempoAtual >= inicioNoite && tempoAtual <= finalNoite) {
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
                  quantNoite <= max ? quantNoite = max : quantNoite = quantNoite;
                }
              }
            }
            //console.log("j: " +j+ " QuantManha: "+ quantManha + " QuantTarde: " + quantTarde + " QuantNoite: "+ quantNoite);
          });
          console.log("QuantManha: "+ quantManha + " QuantTarde: " + quantTarde + " QuantNoite: "+ quantNoite);
          res.send({ code: "SUCCESS" , quantidade: [quantManha, quantTarde, quantNoite] , referencia: patrimonioVetor.length });
        });
      }
    });
  }
}
