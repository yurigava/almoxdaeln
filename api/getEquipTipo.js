module.exports = exports = function(req, res) {
  req.models.EquipamentosMonitorados.get(req.body.patrimonio, function(err, equip) {
    if(err) {
      if(err.literalCode == "NOT_FOUND")
        res.send({
          code: "ERR_NOT_FOUND",
        });
      else
        res.send(err);
    }
    else
      res.send({
        code: "SUCCESS",
        equipTipo: equip.Tipo.id_tipo,
      });
  });
}
