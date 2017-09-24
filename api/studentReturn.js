var sqlQueryGetLentEquips = require('../utils/sqlQueryGetLentEquips.js')

module.exports = exports = function(req, res) {
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
        var findNotContainedAInB = require('../utils/findNotContainedAInB.js')
        var notInRequisicao = findNotContainedAInB(patrimoniosReturning, patrimoniosInRequest);
        if(notInRequisicao.length > 0)
          res.send({code: "ER_NOT_FOUND", notFound: notInRequisicao});
        else {
          var notReturned = findNotContainedAInB(patrimoniosInRequest, patrimoniosReturning);

          var changeEquipState = require('../utils/changeEquipState.js')
          changeEquipState(req, res, "Disponível", false);

          if(notReturned.length > 0) {
            req.models.EquipamentosMonitorados.find({patrimonio: notReturned}, function(err, equips) {
              if(err)
                res.send(err);
              else {
                var notReturnedInfo = [];
                equips.forEach(function (equip) {
                  notReturnedInfo.push({
                    pat: equip.patrimonio,
                    familia: equip.Tipo.Familia.familia,
                    tipo: equip.Tipo.tipo,
                  });
                });
                res.send({code: "WAR_MISSING_EQUIPS", missingEquips: notReturnedInfo});
              }
            });
          }
          else {
            res.send({code: "SUCCESS"})
          }
        }
      }
    }
  );
}
