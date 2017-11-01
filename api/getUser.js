module.exports = exports = function(req, res) {
  var users = [];
  console.log("oi");
  req.models.Usuarios.find({}, function (err, usuarios) {
    if(err)
      res.send(err);
    else {
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
      res.send({ code: "SUCCESS", users: users });
      //res.send({ code: "SUCCESS", equipamentos: equips, requisicoes: requisicoesInfo });
      //res.send(users);
    }
  });
}
