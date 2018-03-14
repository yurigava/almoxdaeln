var sqlQueryGetAllLentEquips = require('../utils/sqlQueryGetAllLentEquips.js')

module.exports = exports = function(req, res) {
  req.db.driver.execQuery(sqlQueryGetAllLentEquips, [3], function (err, equipsInRequest) {
    if(err)
      res.send(err);
    else {
      var pendencias = [];
      equipsInRequest.forEach(function(element,index) {
        //console.log("equips["+index+"]: " + element.usuario + " pat: " + element.EquipamentosMonitorados_patrimonio);
      });
      var del = [];
      var duplicado = false;
      for(var i=0; i<equipsInRequest.length; i++) {
        duplicado = false;
        pendencias.push({
          usuario: equipsInRequest[i].usuario,
          quantidade: 1
        });
        for(var j=0; j< i; j++) {
          if(pendencias[i].usuario === pendencias[j].usuario && duplicado === false) {
            pendencias[j].quantidade = pendencias[j].quantidade + 1;
            del.push({ i: i });
            duplicado = true;
          }
          else{
          }
        }
      }

      del.forEach(function(element,index) {
        pegetAllLentEquipsndencias.splice((element.i - index),1);
      });
      pendencias.forEach(function(element,index) {
        console.log("usuario: " + element.usuario + " quantidade: " + element.quantidade);
      });

      res.send({code: "SUCCESS", pendencias: pendencias});
    }
  });
}