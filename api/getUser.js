module.exports = exports = function(req, res) {
  req.models.Usuarios.find({}, function (err, usuarios) {
    if(err)
      res.send(err);
    else {
      var users = [];
      usuarios.forEach(function (campo) {
        users.push({
          //id_user: campo.id_user,
          id: campo.user,
          role: campo.role,
        });
      });

      users.forEach(function (campo) {
        console.log("usuario: " + campo.id + " role: " + campo.role);
      });
      //res.send({ code: "SUCCESS", users: users });
      res.send(users);
    }
  });
}
