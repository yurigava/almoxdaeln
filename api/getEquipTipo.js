module.exports = exports = function(req, res) {
  req.models.EquipamentosMonitorados.get(req.body.patrimonio, function(err, equip) {
    if(err) {
      if(err.literalCode == "NOT_FOUND")
        res.send({code: "ER_NOT_FOUND"});
      else
        res.send(err);
    }
    else
      if(equip.Estados_id_estado != 4) {
        res.send({
          code: "ER_NOT_AVAILABLE",
          equipTipo: equip.Tipo.id_tipo
        })
      }
      else {
        res.send({
          code: "SUCCESS",
          equipTipo: equip.Tipo.id_tipo
        });
      }
  });
}
