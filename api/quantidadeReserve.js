module.exports = exports = function(req, res) {
  var equipFamilia = req.body.familia;
  var equipTipo = req.body.tipo;
  var name = req.body.name;
  console.log("familia: " + equipFamilia + " tipo: " + equipTipo + " name: " + name);

  if (equipTipo === null) {
    var quantityTotal = 0;
    var i=0;
    req.models.Tipos.find({Familias_id_familia: equipFamilia}, function (err, tipos) {
      if(err)
        res.send(err);

      tipos.forEach(function (equip) {
        req.models.EquipamentosMonitorados.count({Tipos_id_tipo: equip.id_tipo}, function(err, quantidade) {
          if(err)
            res.send(err);
          quantityTotal = Number(quantityTotal) + Number(quantidade);
          console.log("quantityTotal: " + quantityTotal);
          i++;
          if(i>=tipos.length) {
            quantityTotal > 0 ? res.send({ code: "SUCCESS" , quantidade: quantityTotal, name: name }) : res.send({ code: "ERROR" , quantidade: 0, name: name });
          }
          else {}
        });
      });
    });
  }
  else {
    var quantityTotalTipo = 0;

    req.models.EquipamentosMonitorados.count({Tipos_id_tipo: equipTipo}, function(err, quantidade) {
      if(err)
        res.send(err);
      quantityTotalTipo = Number(quantidade);
      console.log("quantityTotalTipo: " + quantityTotalTipo);

      quantityTotalTipo > 0 ? res.send({ code: "SUCCESS" , quantidade: quantityTotalTipo, name: name }) : res.send({ code: "ERROR" , quantidade: 0, name: name });
    });
  }
}
