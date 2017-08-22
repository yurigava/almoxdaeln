module.exports = exports = function(req, res) {
  var familiaNewName = req.body.familiaNewName;
  var familia = req.body.familia;
  req.models.Familias.exists({familia: familiaNewName}, function(errExists, doesFamiliaExists) {
    if(errExists)
      res.send(errExists);
    else if(!doesFamiliaExists) {
      req.models.Familias.get(familia, function(errGet, oldFamilia) {
        if(errGet)
          res.send(errGet);
        else {
          var oldName = oldFamilia.familia;
          oldFamilia.familia = familiaNewName;
          oldFamilia.save(function(err) {
            if(err)
              res.send(err);
            else
              res.send({code: "SUCCESS", oldName: oldName})
          });
        }
      });
    }
    else {
      res.send({code: "ER_DUP_ENTRY"})
    }
  });
}
