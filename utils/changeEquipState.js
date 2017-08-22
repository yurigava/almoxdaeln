module.exports = exports = function changeEquipState(req, res, stateToSet, sendResponse) {
  var patrimonios = req.body.patrimonios;
  var observacao = req.body.observacao;
  var usuario = req.body.usuario;
  var equipsToRegister = [];

  req.models.Estados.one({estado: stateToSet}, function(err, state) {
    patrimonios.forEach(function(pat) {
      equipsToRegister.push({
        observacao: observacao,
        usuario: usuario,
        Estados_id_estado: state.id_estado,
        EquipamentosMonitorados_patrimonio: pat,
      });
    });
    req.models.HistoricoEquipamentos.create(equipsToRegister, function(err) {
      if(err) {
        if(sendResponse)
          res.send(err);
        else
          return -1;
      }
      else {
        req.models.EquipamentosMonitorados.find(
          { patrimonio: patrimonios },
          function(err, equips) {
            var registeredEquips = [];
            equips.forEach(function (equip) {
              registeredEquips.push({
                pat: equip.patrimonio,
                familia: equip.Tipo.Familia.familia,
                tipo: equip.Tipo.tipo,
              });
              equip.setEstado(state, function(err) {});
            });
            if(sendResponse)
              res.send({code: "SUCCESS", registeredEquips: registeredEquips});
            else
              return 1;
          }
        );
      }
    });
  });
}
