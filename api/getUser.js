module.exports = exports = function(req, res) {
  var users = [];
  req.models.Usuarios.find({}, function (err, usuarios) {
    if(err)
      res.send(err);
    else {
      usuarios.forEach(function (campo) {
        users.push({
          id: campo.user,
          role: campo.role,
        });
      });
      users.forEach(function (campo) {
        console.log("usuario: " + campo.id + " role: " + campo.role);
      });
      res.send({ code: "SUCCESS", users: users });
    }
  });
}
