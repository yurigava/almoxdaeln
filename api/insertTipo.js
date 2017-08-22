module.exports = exports = function(req, res) {
  var tipo = req.body.tipo;
  var familia = req.body.Familias_id_familia;
  req.models.Tipos.exists({ tipo: tipo, Familias_id_familia: familia }, function(err, doesTipoExists) {
    if(!doesTipoExists) {
      req.models.Tipos.create(req.body, function(err) {
        if(err)
          res.send(err);
        else
          res.send('ok');
      });
    }
    else {
      res.send({ code: "ER_DUP_ENTRY" });
    }
  });
}
