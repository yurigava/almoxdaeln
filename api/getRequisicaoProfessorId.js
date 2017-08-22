module.exports = exports = function(req,res) {
  var usuario = req.body.usuario;
  console.log(usuario);
  var date = req.body.date;
  console.log(date);
  var turno = req.body.turno;
  console.log(turno);
  var materia = req.body.materia;
  console.log(materia);
  req.models.Requisicoes.find(
    {
      usuario: usuario,
      dataDeUso: date,
      turno: turno,
      materia: materia,
      EstadosReq_id_estadosReq: 1,
    },
    function(err, existentRequisicao) {
      if(err)
        res.send(err);
      else if(existentRequisicao.length > 0)
        res.send({
          code: "SUCCESS",
          idRequisicao: existentRequisicao[0].id_requisicao,
        });
      else {
        var requisicao = {
          usuario: usuario,      
          dataDeUso: date,
          turno: turno,
          materia: materia,
          EstadosReq_id_estadosReq: 1,
        };
        req.models.Requisicoes.create(requisicao, function(err, createdRequisicao) {
          if(err)
            res.send(err);
          else
            res.send({
              code: "SUCCESS",
              idRequisicao: createdRequisicao.id_requisicao,
            });
        });
      }
    }
  );
}
