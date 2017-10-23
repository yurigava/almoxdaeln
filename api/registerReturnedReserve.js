var changeEquipState = require('../utils/changeEquipState.js')

module.exports = exports = function(req, res) {
  req.models.Requisicoes.one({id_requisicao: req.body.reserveId}, function(err, requisicao) {
    if(err)
      res.send(err);
    else if(requisicao !== null) {
      if(err)
        res.send(err);
      else {
        req.models.Carrinhos.find({Requisicoes_id_requisicao: req.body.reserveId}, function(err, carrinhos) {
          if(err)
            res.send(err);
          else {
            req.body.usuario = requisicao.usuario;
            req.models.EstadosReq.one({id_estadosReq: 2}, function(err, state) {
              changeEquipState(req, res, "Disponível", false);
              requisicao.setEstadoReq(state, function(err) {});
              res.send({code: "SUCCESS"});
            });
            carrinhos.forEach(function(carrinho) {
              carrinho.Requisicoes_id_requisicao = null;
              carrinho.save(function(err) {});
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
