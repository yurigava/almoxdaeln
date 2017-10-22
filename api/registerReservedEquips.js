var changeEquipState = require('../utils/changeEquipState.js')
var sqlQueryGetLentEquips = require('../utils/sqlQueryGetLentEquips.js')

module.exports = exports = function(req, res) {
  req.models.Requisicoes.one({id_requisicao: req.body.requisicao}, function(err, requisicao) {
    if(err)
      res.send(err);
    else if(requisicao !== null) {
      req.body.usuario = req.body.usuario;
      req.models.Carrinhos.find({id_carrinho: req.body.carrinhos}, function(err, carrinhos) {
        if(err)
          res.send(err);
        else {
          carrinhos.forEach(function(carrinho) {
            carrinho.setRequisicao(requisicao, function(err) {})
          });
          req.models.EstadosReq.one({id_estadosReq: 4}, function(err, state) {
            changeEquipState(req, res, "Reservado", false);
            requisicao.setEstadoReq(state, function(err) {});
            res.send({code: "SUCCESS"});
          });
        }
      });
    }
    else {
      res.send({code: "ER_NOT_FOUND"});
    }
  });
}
