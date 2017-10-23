var sqlQueryGetAllLentEquips = require('../utils/sqlQueryGetAllLentEquips.js')

module.exports = exports = function(req, res) {
  var usuario = "admin";
  console.log("oi");
  req.db.driver.execQuery(sqlQueryGetAllLentEquips, [3], function (err, equipsInRequest) {
    if(err)
      res.send(err);
    else {
      equipsInRequest.forEach(function(element) {
        console.log("equips: " + element.EquipamentosMonitorados_patrimonio);
      });

      res.send({code: "SUCCESS", equipamentos: equipsInRequest, requisicoes: equipsInRequest});
    }
  });
}