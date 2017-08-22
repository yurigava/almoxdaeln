var changeEquipState = require('../utils/changeEquipState.js')
var sqlQueryGetLentEquips = require('../utils/sqlQueryGetLentEquips.js')

module.exports = exports = function(req, res) {
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
        var findNotContainedAInB = require('../utils/findNotContainedAInB.js')
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
}
