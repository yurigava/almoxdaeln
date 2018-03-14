var sqlQueryGetLentEquips = require('../utils/sqlQueryGetLentEquips.js')

module.exports = exports = function(req, res) {
  req.models.Requisicoes.one({ id_requisicao: req.body.reserveId },
    function(err, requisicao) {
      if(err)
        res.send(err)
      else {
        req.db.driver.execQuery(sqlQueryGetLentEquips, [requisicao.usuario, 1], function (err, equipsInHistory) {
          if(err)
            res.send(err)
          else {
            req.models.EquipamentosMonitorados.find(
              {patrimonio: equipsInHistory.map(equip => equip.EquipamentosMonitorados_patrimonio)},
              function (err, equips) {
                if(err)
                  res.send(err);
                else {
                  var tipos = equips.map(equip => equip.Tipos_id_tipo).filter((v, i, self) => self.indexOf(v) === i);
                  var tiposInReq = [];
                  tipos.forEach(function(tipo) {
                    var equipByTipo = equips.filter(equip => equip.Tipo.id_tipo == tipo);
                    tiposInReq.push({
                      name:  equipByTipo[0].Tipo.Familia.familia + " " + equipByTipo[0].Tipo.tipo,
                      count: equipByTipo.length,
                      equips: equipByTipo.map(equip => equip.patrimonio)
                    });
                  });
                  res.send({code: "SUCCESS", lentEquips: tiposInReq});
                }
              }
            );
          }
        });
      }
    }
  );
}
