module.exports = exports = function(req, res) {
  req.models.EquipamentosRequisicao.find({Requisicoes_id_requisicao: req.body.reserveId}, function(err, equips) {
    if(err)
      res.send(err)
    else {
      var formattedEquips = [];
      equips.forEach(function(equip) {
        formattedEquips.push({
          familia: equip.Familias_id_familia,
          tipo: equip.Tipos_id_tipo,
          current: 0,
          total: equip.quantidade,
        });
      })
      res.send({code: "SUCCESS", reserveEquips: formattedEquips});
    }
  })
}
