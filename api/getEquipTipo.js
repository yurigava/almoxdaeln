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
        req.send({code: "ER_NOT_AVAILABLE"})
      }
      else {
        res.send({
          code: "SUCCESS",
          equipTipo: equip.Tipo.id_tipo,
        });
      }
  });
}
