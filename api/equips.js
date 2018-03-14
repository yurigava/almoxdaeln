module.exports = exports = function(req, res) {
  req.models.EquipamentosMonitorados.find({}, function (err, equipamentos) {
    if(err)
      res.send(err);
    else
      res.send(equipamentos);
  });
};
