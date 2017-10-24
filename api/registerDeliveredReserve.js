var changeEquipState = require('../utils/changeEquipState.js')
var sqlQueryGetLentEquips = require('../utils/sqlQueryGetLentEquips.js')

module.exports = exports = function(req, res) {
  req.models.Requisicoes.one({id_requisicao: req.body.requisicao}, function(err, requisicao) {
    if(err)
      res.send(err);
    else if(requisicao !== null) {
      if(err)
        res.send(err);
      else {
        req.body.usuario = requisicao.usuario;
        req.db.driver.execQuery(sqlQueryGetLentEquips, [requisicao.usuario, 3], function (err, equipsInRequest) {
          if(err)
            res.send(err);
          else {
            req.body.patrimonios = equipsInRequest.map(equip => equip.EquipamentosMonitorados_patrimonio);
            req.models.EstadosReq.one({id_estadosReq: 1}, function(err, state) {
              changeEquipState(req, res, "Emprestado", false);
              requisicao.setEstadoReq(state, function(err) {});
              res.send({code: "SUCCESS"});
            });
          }
        });
      }
    }
    else {
      res.send({code: "ER_NOT_FOUND"});
    }
  });
}
