module.exports = exports = function(req,res) {
  var userRoles = req.body.userRoles;
  userRoles.forEach(function (campo) {
    console.log("1" + campo);
  });
  var idUser = userRoles.map(equip => equip.user);
  idUser.forEach(function (campo) {
    console.log(campo);
  });
  req.models.Usuarios.find({user: idUser}).remove(function(err, doesUserExists) {
  //req.models.Usuarios.find({user: "nada"}).remove(function(err, doesUserExists) {
      if(err)
        res.send(err);
      else {
        console.log(doesUserExists);
        //userRoles.forEach(function(userRole) {
          //userRole.Requisicoes_id_requisicao = null;
          //userRole.save(function(err) {});
        //});
        req.models.Usuarios.create(userRoles, function(err, createdUserRole) {
          if(err)
            res.send(err);
          else {
            createdUserRole.forEach(function (campo) {
              console.log("id: " + campo.id_user);
            });
            //res.send({
            //  code: "SUCCESS",
            //  idRequisicao: createdRequisicao.id_requisicao,
            //});
          }
        });
      }
    }
  );
}
