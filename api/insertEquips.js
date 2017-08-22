module.exports = exports = function(req, res) {
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
      var findNotContainedAInB = require('../utils/findNotContainedAInB.js')
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
}
