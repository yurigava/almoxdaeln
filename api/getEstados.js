module.exports = exports = function(req, res) {
  req.models.Estados.find({}, function(err, estados) {
    if(err)
      res.send(err);
    else
      res.send(estados);
  });
}
