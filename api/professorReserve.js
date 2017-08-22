module.exports = exports = function(req, res) {
  var requisicao = req.body.requisicao;
  var equips = req.body.equips;
  var reserveToInsert = [];
  req.body.equips.forEach(function(pat) {
    console.log("familia: " + pat.familia + " tipo: " + pat.tipo + " quantidade: " + pat.quantidade);
    if(pat.tipo === null) {
      reserveToInsert.push({
        Requisicoes_id_requisicao: requisicao,
        Familias_id_familia: pat.familia,
        Tipos_id_tipo: null,
        quantidade: pat.quantidade
      });
    }
    else {
      reserveToInsert.push({
        Requisicoes_id_requisicao: requisicao,
        Familias_id_familia: pat.familia,
        Tipos_id_tipo: pat.tipo,
        quantidade: pat.quantidade
      });
    }
  });
  console.log(reserveToInsert);
  req.models.EquipamentosRequisicao.create(reserveToInsert, function(err) {
    if(err)
      res.send(err);
    else
      res.send('ok');
      console.log('oi');
  });
}
