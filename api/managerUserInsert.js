module.exports = exports = function(req,res) {
  var userRoles = req.body.userRoles;
  var idUser = userRoles.map(user => user.user === userRoles.id);
   idUser.forEach(function (campo) {
    console.log(campo)
  });
  req.models.Usuarios.exists({user: idUser}, function(err, doesUserExists) {
  //req.models.Usuarios.find({},function(err, users) {
      if(err)
        res.send(err);
      else {
        doesUserExists.forEach(function (campo) {
          console.log(campo)
        });
      }
    }
  );
}
