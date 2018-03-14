module.exports = exports = function(req, res) {
  req.models.Familias.find({}, "familia", function (err, familias) {
    if(err)
      res.send(err);
    else
      res.send(familias);
  });
}
