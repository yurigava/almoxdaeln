module.exports = exports = function(req,res) {
  var usuario = "yuri";
  var usuarios = [];
  var id_initial = "";
  var userRoles = req.body.userRoles;
  var idUser = userRoles.map(equip => equip.user);
  //idUser.forEach(function (campo) {
  //console.log(campo);
  //});
  req.models.Usuarios.find({}, function(err, users) {
    if(err)
      res.send(err);
    else {
      users.forEach(function (campo) {
        if(campo.user !== usuario) {
          usuarios.push({
            user: campo.user
          });
        }
        else {
          //id_initial = campo.id_user;
          //console.log("id_initial: " + id_initial);
        }
      });
      var variavel = usuarios.map(equip => equip.user);
      variavel.forEach(function (campo) {
        //console.log(campo);
      });
      
      req.models.Usuarios.find({user: variavel}).remove(function(err, doesUserExists) {
        if(err)
          res.send(err);
        else {
          console.log(doesUserExists);
          req.models.Usuarios.create(userRoles, function(err, createdUserRole) {
            if(err)
              res.send(err);
            else {
              createdUserRole.forEach(function (campo) {
                //console.log("id: " + campo.id_user);
              });
              res.send({ code: "SUCCESS"});
            }
          });
        }
      });
    }
  });
}
