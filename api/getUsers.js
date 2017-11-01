module.exports = exports = function(req, res) {
  req.models.Usuarios.find({}, function (err, usuarios) {
    if(err)
      res.send(err);
    else {
      var users = [];
      usuarios.forEach(function (campo) {
        users.push({
          id: campo.user,
          role: campo.role,
        });
      });
      res.send({code: "SUCCESS", users: users });
    }
  });
}
