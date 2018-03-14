module.exports = exports = function(req, res) {
  req.models.Familias.exists(req.body, function(errExists, doesFamiliaExists) {
    if(errExists)
      res.send(errExists);
    else if(!doesFamiliaExists) {
      req.models.Familias.create(req.body, function(errCreate, familia) {
        if(errCreate)
          res.send(errCreate);
        else {
          res.send({
            id_familia: familia.id_familia,
            code: "SUCCESS"
          });
        }
      });
    }
    else { //Familia Exists
      res.send({ code: "ER_DUP_ENTRY" });
    }
  });
}
