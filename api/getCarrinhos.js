module.exports = exports = function(req, res) {
  req.models.Carrinhos.find({Requisicoes_id_requisicao: null}, function(err, carrinhos) {
    if(err)
      res.send(err);
    else {
      var carrinhosCodes = carrinhos.map(carrinho => carrinho.id_carrinho.toString());
      res.send({
        code: "SUCCESS",
        carrinhos: carrinhosCodes
      });
    }
  });
}
