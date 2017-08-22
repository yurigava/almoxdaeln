module.exports = exports = function(req, res) {
  var tipoNewName = req.body.tipoNewName;
  var id_familia = req.body.id_familia;
  var id_tipo = req.body.id_tipo;
  req.models.Tipos.exists({ tipo: id_tipo, Familias_id_familia: id_familia }, function(errExists, doesTipoExists) {
    if(errExists)
      res.send(errExists);
    else if(!doesTipoExists) {
      req.models.Tipos.get(id_tipo, function(errGet, oldTipo) {
        if(errGet)
          res.send(errGet);
        else {
          var oldName = oldTipo.tipo;
          oldTipo.tipo = tipoNewName;
          oldTipo.save(function(err) {
            if(err)
              res.send(err);
            else
              res.send({code: "SUCCESS", oldName: oldName, familia: oldTipo.Familia.familia})
          });
        }
      });
    }
    else {
      res.send({code: "ER_DUP_ENTRY"})
    }
  });
}
