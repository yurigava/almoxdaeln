module.exports = exports = function(req, res) {
  req.models.Tipos.find({}, "tipo", function (err, tipos) {
    if(err)
      res.send(err);
    else
      res.send(tipos);
  });
}
