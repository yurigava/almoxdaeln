module.exports = exports = function(req, res) {
  var usuario = req.body.usuario;
  var patrimonio = req.body.patrimonio;
  var reqEstado = req.body.estado;
  var observacao = req.body.observacao;
  req.models.EquipamentosMonitorados.get(patrimonio, function(err, equip) {
    if(!equip)
      res.send({code: "ER_NOT_FOUND"});
    else if(err)
      res.send(err);
    else {
      if(equip.Estados_id_estado === reqEstado)
        res.send({code: "ER_SAME_STATE"});
      else {
        req.models.Estados.get(reqEstado, function(err, estado) {
          equip.setEstado(estado, function(e) {});
          var eventsToCreate = [{
            observacao: observacao,
            usuario: usuario,
            EquipamentosMonitorados_patrimonio: patrimonio,
            Estados_id_estado: estado.id_estado
          }];
          req.models.HistoricoEquipamentos.one( //If equip is lent, fix user pendency
            {
              EquipamentosMonitorados_patrimonio: patrimonio,
              Estados_id_estado: 1
            },
            ["timestamp", "Z"],
            1,
            function (err, lastEvent) {
              if(lastEvent !== null)
                eventsToCreate.unshift({
                  observacao: "Situação Regularizada",
                  usuario: lastEvent.usuario,
                  EquipamentosMonitorados_patrimonio: patrimonio,
                  Estados_id_estado: 4
                });
              req.models.HistoricoEquipamentos.create(eventsToCreate, function(err) {
                if(err)
                  res.send(err);
                else
                  res.send({
                    code: "SUCCESS",
                    estado: estado.estado,
                    familia: equip.Tipo.Familia.familia,
                    tipo: equip.Tipo.tipo,
                  });
              });
            }
          );
        });
      }
    }
  });
}
